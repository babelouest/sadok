/**
 *
 * Sadok e-book reader
 *
 * Profile management API in C using ulfius framework
 *
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <https://www.gnu.org/licenses/>. 
 *
 */

#include <jansson.h>
#include <ulfius.h>

#include <getopt.h>
#include <signal.h>
#include <ctype.h>
#include <libconfig.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>
#include <gnutls/gnutls.h>
#include <gnutls/crypto.h>

#define _SADOK_VERSION_ "2.0.0"

#define SADOK_DEFAULT_PORT                7235
#define SADOK_DEFAULT_PREFIX              "api"
#define SADOK_LOG_NAME                    "Sadok"
#define SADOK_DEFAULT_MAX_POST_SIZE       (16*1024*1024)+1024

#define SADOK_STOP     0
#define SADOK_ERROR    1

#define SADOK_CALLBACK_PRIORITY_ZERO           0
#define SADOK_CALLBACK_PRIORITY_AUTHENTICATION 1
#define SADOK_CALLBACK_PRIORITY_APPLICATION    2

/** Macro to avoid compiler warning when some parameters are unused and that's ok **/
#define UNUSED(x) (void)(x)

struct config_elements {
  char                                         * config_file;
  unsigned int                                   port;
  char                                         * api_prefix;
  unsigned long                                  log_mode;
  unsigned long                                  log_level;
  char                                         * log_file;
  char                                         * allow_origin;
  unsigned int                                   use_secure_connection;
  char                                         * secure_connection_key_file;
  char                                         * secure_connection_pem_file;
  struct _u_instance                           * instance;
  char                                         * data_file;
  pthread_mutex_t                                file_lock;
};

// Main functions and misc functions
int  build_config_from_args(int argc, char ** argv, struct config_elements * config);
int  build_config_from_file(struct config_elements * config);
int  check_config(struct config_elements * config);
void exit_handler(int handler);
void exit_server(struct config_elements ** config, int exit_value);
void print_help(FILE * output);
char * get_file_content(const char * file_path);

pthread_mutex_t global_handler_close_lock;
pthread_cond_t  global_handler_close_cond;

int callback_profile_status (const struct _u_request * request, struct _u_response * response, void * user_data) {
  UNUSED(request);
  UNUSED(response);
  UNUSED(user_data);
  return U_CALLBACK_CONTINUE;
}

int callback_profile_get_config (const struct _u_request * request, struct _u_response * response, void * user_data) {
  struct config_elements * config = (struct config_elements *)user_data;
  json_t * j_data, * j_profile, * j_obj_empty;

  if (!pthread_mutex_lock(&config->file_lock)) {
    if ((j_data = json_load_file(config->data_file, JSON_DECODE_ANY, NULL)) != NULL) {
      if (json_is_object(j_data)) {
        if (o_strnullempty(u_map_get(request->map_url, "name")) ||
            o_strlen(u_map_get(request->map_url, "name")) >= 128) {
          response->status = 400;
        } else if (json_is_object(json_object_get(j_data, u_map_get(request->map_url, "name")))) {
          j_profile = json_object_get(j_data, u_map_get(request->map_url, "name"));
          if (json_is_object(json_object_get(j_profile, "config"))) {
            ulfius_set_json_body_response(response, 200, json_object_get(j_profile, "config"));
          } else {
            j_obj_empty = json_object();
            ulfius_set_json_body_response(response, 200, j_obj_empty);
            json_decref(j_obj_empty);
          }
        } else {
          j_obj_empty = json_object();
          ulfius_set_json_body_response(response, 200, j_obj_empty);
          json_decref(j_obj_empty);
        }
      } else {
        y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_get_config - Error j_data is not an object");
        response->status = 500;
      }
      json_decref(j_data);
    } else {
      y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_get_config - Error json_load_file");
      response->status = 500;
    }
    pthread_mutex_unlock(&config->file_lock);
  } else {
    y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_get_config - Error pthread_mutex_lock");
    response->status = 500;
  }
  return U_CALLBACK_CONTINUE;
}

int callback_profile_set_config (const struct _u_request * request, struct _u_response * response, void * user_data) {
  struct config_elements * config = (struct config_elements *)user_data;
  json_t * j_config = ulfius_get_json_body_request(request, NULL), * j_data;

  if (!pthread_mutex_lock(&config->file_lock)) {
    if (json_is_object(j_config) && !o_strnullempty(u_map_get(request->map_url, "name")) && o_strlen(u_map_get(request->map_url, "name")) < 128) {
      if ((j_data = json_load_file(config->data_file, JSON_DECODE_ANY, NULL)) != NULL) {
        if (json_is_object(j_data)) {
          if (!json_is_object(json_object_get(j_data, u_map_get(request->map_url, "name")))) {
            json_object_set_new(j_data, u_map_get(request->map_url, "name"), json_pack("{s{}s{}}", "config", "bookshelf"));
          }
          json_object_set(json_object_get(j_data, u_map_get(request->map_url, "name")), "config", j_config);
          if (json_dump_file(j_data, config->data_file, JSON_COMPACT)) {
            y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_config - Error json_dump_file");
            response->status = 500;
          }
        } else {
          y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_config - Error json_load_file");
          response->status = 500;
        }
        json_decref(j_data);
      } else {
        y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_config - Error json_load_file");
        response->status = 500;
      }
    } else {
      response->status = 400;
    }
    pthread_mutex_unlock(&config->file_lock);
  } else {
    y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_config - Error pthread_mutex_lock");
    response->status = 500;
  }
  json_decref(j_config);
  return U_CALLBACK_CONTINUE;
}

int callback_profile_get_book (const struct _u_request * request, struct _u_response * response, void * user_data) {
  struct config_elements * config = (struct config_elements *)user_data;
  json_t * j_data, * j_profile, * j_obj_empty;

  if (!pthread_mutex_lock(&config->file_lock)) {
    if ((j_data = json_load_file(config->data_file, JSON_DECODE_ANY, NULL)) != NULL) {
      if (json_is_object(j_data)) {
        if (o_strnullempty(u_map_get(request->map_url, "name")) ||
            o_strlen(u_map_get(request->map_url, "name")) >= 128) {
          response->status = 400;
        } else if (json_is_object(json_object_get(j_data, u_map_get(request->map_url, "name")))) {
          j_profile = json_object_get(j_data, u_map_get(request->map_url, "name"));
          if (o_strnullempty(u_map_get(request->map_url, "book_uri"))) {
            if (json_is_object(json_object_get(j_profile, "bookshelf"))) {
              ulfius_set_json_body_response(response, 200, json_object_get(j_profile, "bookshelf"));
            } else {
              j_obj_empty = json_object();
              ulfius_set_json_body_response(response, 200, j_obj_empty);
              json_decref(j_obj_empty);
            }
          } else {
            if (!o_strnullempty(u_map_get(request->map_url, "book_uri")) &&
                o_strlen(u_map_get(request->map_url, "book_uri")) < 512) {
              if (json_is_object(json_object_get(json_object_get(j_profile, "bookshelf"), u_map_get(request->map_url, "book_uri")))) {
                ulfius_set_json_body_response(response, 200, json_object_get(json_object_get(j_profile, "bookshelf"), u_map_get(request->map_url, "book_uri")));
              } else {
                j_obj_empty = json_object();
                ulfius_set_json_body_response(response, 200, j_obj_empty);
                json_decref(j_obj_empty);
              }
            } else {
              response->status = 400;
            }
          }
        } else {
          j_obj_empty = json_object();
          ulfius_set_json_body_response(response, 200, j_obj_empty);
          json_decref(j_obj_empty);
        }
      } else {
        y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_get_book - Error j_data is not an object");
        response->status = 500;
      }
      json_decref(j_data);
    } else {
      y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_get_book - Error json_load_file");
      response->status = 500;
    }
    pthread_mutex_unlock(&config->file_lock);
  } else {
    y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_get_book - Error pthread_mutex_lock");
    response->status = 500;
  }
  return U_CALLBACK_CONTINUE;
}

int callback_profile_set_book (const struct _u_request * request, struct _u_response * response, void * user_data) {
  struct config_elements * config = (struct config_elements *)user_data;
  json_t * j_book = ulfius_get_json_body_request(request, NULL), * j_data;

  if (!pthread_mutex_lock(&config->file_lock)) {
    if (json_is_object(j_book) && !o_strnullempty(u_map_get(request->map_url, "name")) && o_strlen(u_map_get(request->map_url, "name")) < 128) {
      if ((j_data = json_load_file(config->data_file, JSON_DECODE_ANY, NULL)) != NULL) {
        if (json_is_object(j_data)) {
          if (!json_is_object(json_object_get(j_data, u_map_get(request->map_url, "name")))) {
            json_object_set_new(j_data, u_map_get(request->map_url, "name"), json_pack("{s{}s{}}", "config", "bookshelf"));
          }
          json_object_set(json_object_get(json_object_get(j_data, u_map_get(request->map_url, "name")), "bookshelf"), u_map_get(request->map_url, "book_uri"), j_book);
          if (json_dump_file(j_data, config->data_file, JSON_COMPACT)) {
            y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_book - Error json_dump_file");
            response->status = 500;
          }
        } else {
          y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_book - Error json_load_file");
          response->status = 500;
        }
        json_decref(j_data);
      } else {
        y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_book - Error json_load_file");
        response->status = 500;
      }
    } else {
      response->status = 400;
    }
    pthread_mutex_unlock(&config->file_lock);
  } else {
    y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_set_book - Error pthread_mutex_lock");
    response->status = 500;
  }
  json_decref(j_book);
  return U_CALLBACK_CONTINUE;
}

int callback_profile_delete_book (const struct _u_request * request, struct _u_response * response, void * user_data) {
  struct config_elements * config = (struct config_elements *)user_data;
  json_t * j_data;

  if (!pthread_mutex_lock(&config->file_lock)) {
    if (!o_strnullempty(u_map_get(request->map_url, "name")) && o_strlen(u_map_get(request->map_url, "name")) < 128) {
      if ((j_data = json_load_file(config->data_file, JSON_DECODE_ANY, NULL)) != NULL) {
        if (json_is_object(j_data)) {
          if (!json_is_object(json_object_get(j_data, u_map_get(request->map_url, "name")))) {
            json_object_set_new(j_data, u_map_get(request->map_url, "name"), json_pack("{s{}s{}}", "config", "bookshelf"));
          }
          json_object_del(json_object_get(json_object_get(j_data, u_map_get(request->map_url, "name")), "bookshelf"), u_map_get(request->map_url, "book_uri"));
          if (json_dump_file(j_data, config->data_file, JSON_COMPACT)) {
            y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_delete_book - Error json_dump_file");
            response->status = 500;
          }
        } else {
          y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_delete_book - Error json_load_file");
          response->status = 500;
        }
      } else {
        y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_delete_book - Error json_load_file");
        response->status = 500;
      }
      json_decref(j_data);
    } else {
      response->status = 400;
    }
    pthread_mutex_unlock(&config->file_lock);
  } else {
    y_log_message(Y_LOG_LEVEL_ERROR, "callback_profile_delete_book - Error pthread_mutex_lock");
    response->status = 500;
  }
  return U_CALLBACK_CONTINUE;
}

/**
 *
 * Main function
 *
 * Initialize config structure, parse the arguments and the config file
 * Then run the webservice
 *
 */
int main (int argc, char ** argv) {
  struct config_elements * config = o_malloc(sizeof(struct config_elements));
  int res;
  pthread_mutexattr_t mutexattr;

  if (config == NULL) {
    fprintf(stderr, "Memory error - config\n");
    return 1;
  }

  // Init config structure with default values
  config->config_file = NULL;
  config->port = SADOK_DEFAULT_PORT;
  config->api_prefix = o_strdup(SADOK_DEFAULT_PREFIX);
  config->log_mode = Y_LOG_MODE_NONE;
  config->log_level = Y_LOG_LEVEL_NONE;
  config->log_file = NULL;
  config->data_file = NULL;
  config->instance = o_malloc(sizeof(struct _u_instance));
  config->allow_origin = NULL;
  config->use_secure_connection = 0;
  config->secure_connection_key_file = NULL;
  config->secure_connection_pem_file = NULL;
  if (config->instance == NULL) {
    fprintf(stderr, "Memory error - config->instance || config->static_file_config || config->i_session\n");
    o_free(config);
    return 1;
  }

  if (pthread_mutex_init(&global_handler_close_lock, NULL) ||
      pthread_cond_init(&global_handler_close_cond, NULL)) {
    y_log_message(Y_LOG_LEVEL_ERROR, "init - Error initializing global_handler_close_lock or global_handler_close_cond");
  }
  // Catch end signals to make a clean exit
  signal (SIGQUIT, exit_handler);
  signal (SIGINT, exit_handler);
  signal (SIGTERM, exit_handler);
  signal (SIGHUP, exit_handler);

  pthread_mutexattr_init ( &mutexattr );
  pthread_mutexattr_settype( &mutexattr, PTHREAD_MUTEX_RECURSIVE );
  if (pthread_mutex_init(&config->file_lock, &mutexattr) != 0) {
    fprintf(stderr, "Error initializing insert mutex\n");
    exit_server(&config, SADOK_ERROR);
  }
  pthread_mutexattr_destroy(&mutexattr);

  // First we parse command line arguments
  if (!build_config_from_args(argc, argv, config)) {
    fprintf(stderr, "Error reading command-line parameters\n");
    print_help(stderr);
    exit_server(&config, SADOK_ERROR);
  }

  // Then we parse configuration file
  // They have lower priority than command line parameters
  if (!build_config_from_file(config)) {
    fprintf(stderr, "Error config file\n");
    exit_server(&config, SADOK_ERROR);
  }

  // Check if all mandatory configuration variables are present and correctly typed
  if (!check_config(config)) {
    fprintf(stderr, "Error initializing configuration\n");
    exit_server(&config, SADOK_ERROR);
  }

  if (!y_init_logs(SADOK_LOG_NAME, config->log_mode, config->log_level, config->log_file, "Starting Sadok Server")) {
    fprintf(stderr, "Error initializing logs\n");
    exit_server(&config, SADOK_ERROR);
  }

  ulfius_init_instance(config->instance, config->port, NULL, NULL);
  config->instance->max_post_body_size = SADOK_DEFAULT_MAX_POST_SIZE;
  config->instance->max_post_param_size = SADOK_DEFAULT_MAX_POST_SIZE;
  config->instance->allowed_post_processor = U_POST_PROCESS_URL_ENCODED;

  ulfius_add_endpoint_by_val(config->instance, "GET", config->api_prefix, "/profile", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_status, config);
  ulfius_add_endpoint_by_val(config->instance, "GET", config->api_prefix, "/profile/:name/config", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_get_config, config);
  ulfius_add_endpoint_by_val(config->instance, "POST", config->api_prefix, "/profile/:name/config", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_set_config, config);
  ulfius_add_endpoint_by_val(config->instance, "GET", config->api_prefix, "/profile/:name/book/", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_get_book, config);
  ulfius_add_endpoint_by_val(config->instance, "GET", config->api_prefix, "/profile/:name/book/:book_uri", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_get_book, config);
  ulfius_add_endpoint_by_val(config->instance, "POST", config->api_prefix, "/profile/:name/book/:book_uri", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_set_book, config);
  ulfius_add_endpoint_by_val(config->instance, "DELETE", config->api_prefix, "/profile/:name/book/:book_uri", SADOK_CALLBACK_PRIORITY_APPLICATION, &callback_profile_delete_book, config);

  // Set default headers
  u_map_put(config->instance->default_headers, "Access-Control-Allow-Origin", config->allow_origin);
  u_map_put(config->instance->default_headers, "Access-Control-Allow-Credentials", "true");
  u_map_put(config->instance->default_headers, "Cache-Control", "no-store");
  u_map_put(config->instance->default_headers, "Pragma", "no-cache");
  u_map_put(config->instance->default_headers, "X-Frame-Options", "deny");

  y_log_message(Y_LOG_LEVEL_INFO, "Start Sadok on port %d, data file: %s", config->instance->port, config->data_file);

  if (config->use_secure_connection) {
    char * key_file = get_file_content(config->secure_connection_key_file);
    char * pem_file = get_file_content(config->secure_connection_pem_file);
    if (key_file != NULL && pem_file != NULL) {
      res = ulfius_start_secure_framework(config->instance, key_file, pem_file);
    } else {
      res = U_ERROR_PARAMS;
    }
    o_free(key_file);
    o_free(pem_file);
  } else {
    res = ulfius_start_framework(config->instance);
  }
  if (res == U_OK) {
    // Wait until stop signal is broadcasted
    pthread_mutex_lock(&global_handler_close_lock);
    pthread_cond_wait(&global_handler_close_cond, &global_handler_close_lock);
    pthread_mutex_unlock(&global_handler_close_lock);
  } else {
    y_log_message(Y_LOG_LEVEL_ERROR, "Error starting Sadok webservice");
    exit_server(&config, SADOK_ERROR);
  }
  if (pthread_mutex_destroy(&global_handler_close_lock) ||
      pthread_cond_destroy(&global_handler_close_cond)) {
    y_log_message(Y_LOG_LEVEL_ERROR, "Error destroying global_handler_close_lock or global_handler_close_cond");
  }
  exit_server(&config, SADOK_STOP);
  return 0;
}

/**
 * Exit properly the server by closing opened connections, databases and files
 */
void exit_server(struct config_elements ** config, int exit_value) {

  if (config != NULL && *config != NULL) {
    // Cleaning data
    o_free((*config)->config_file);
    o_free((*config)->api_prefix);
    o_free((*config)->log_file);
    o_free((*config)->allow_origin);
    o_free((*config)->secure_connection_key_file);
    o_free((*config)->secure_connection_pem_file);

    ulfius_stop_framework((*config)->instance);
    ulfius_clean_instance((*config)->instance);
    o_free((*config)->instance);
    o_free((*config)->data_file);
    pthread_mutex_destroy(&(*config)->file_lock);

    o_free(*config);
    (*config) = NULL;
  }
  y_close_logs();
  exit(exit_value);
}

/**
 * Initialize the application configuration based on the command line parameters
 */
int build_config_from_args(int argc, char ** argv, struct config_elements * config) {
  int next_option;
  const char * short_options = "c:p:u:m:l:f:h::v::";
  char * tmp = NULL, * to_free = NULL, * one_log_mode = NULL;
  static const struct option long_options[]= {
    {"config-file", optional_argument, NULL, 'c'},
    {"port", optional_argument, NULL, 'p'},
    {"url-prefix", optional_argument, NULL, 'u'},
    {"log-mode", optional_argument, NULL, 'm'},
    {"log-level", optional_argument, NULL, 'l'},
    {"log-file", optional_argument, NULL, 'f'},
    {"help", optional_argument, NULL, 'h'},
    {"version", optional_argument, NULL, 'v'},
    {NULL, 0, NULL, 0}
  };

  if (config != NULL) {
    do {
      next_option = getopt_long(argc, argv, short_options, long_options, NULL);

      switch (next_option) {
        case 'c':
          if (optarg != NULL) {
            if ((config->config_file = o_strdup(optarg)) == NULL) {
              fprintf(stderr, "Error allocating config->config_file, exiting\n");
              exit_server(&config, SADOK_STOP);
            }
          } else {
            fprintf(stderr, "Error!\nNo config file specified\n");
            return 0;
          }
          break;
        case 'p':
          if (optarg != NULL) {
            config->port = (unsigned int)strtol(optarg, NULL, 10);
          } else {
            fprintf(stderr, "Error!\nNo TCP Port number specified\n");
            return 0;
          }
          break;
        case 'u':
          if (optarg != NULL) {
            o_free(config->api_prefix);
            if ((config->api_prefix = o_strdup(optarg)) == NULL) {
              fprintf(stderr, "Error allocating config->api_prefix, exiting\n");
              exit_server(&config, SADOK_STOP);
            }
          } else {
            fprintf(stderr, "Error!\nNo URL prefix specified\n");
            return 0;
          }
          break;
        case 'm':
          if (optarg != NULL) {
            if ((tmp = o_strdup(optarg)) == NULL) {
              fprintf(stderr, "Error allocating log_mode, exiting\n");
              exit_server(&config, SADOK_STOP);
            }
            one_log_mode = strtok(tmp, ",");
            while (one_log_mode != NULL) {
              if (0 == strncmp("console", one_log_mode, o_strlen("console"))) {
                config->log_mode |= Y_LOG_MODE_CONSOLE;
              } else if (0 == strncmp("syslog", one_log_mode, o_strlen("syslog"))) {
                config->log_mode |= Y_LOG_MODE_SYSLOG;
              } else if (0 == strncmp("file", one_log_mode, o_strlen("file"))) {
                config->log_mode |= Y_LOG_MODE_FILE;
              }
              one_log_mode = strtok(NULL, ",");
            }
            o_free(to_free);
          } else {
            fprintf(stderr, "Error!\nNo mode specified\n");
            return 0;
          }
          break;
        case 'l':
          if (optarg != NULL) {
            if (0 == strncmp("NONE", optarg, o_strlen("NONE"))) {
              config->log_level = Y_LOG_LEVEL_NONE;
            } else if (0 == strncmp("ERROR", optarg, o_strlen("ERROR"))) {
              config->log_level = Y_LOG_LEVEL_ERROR;
            } else if (0 == strncmp("WARNING", optarg, o_strlen("WARNING"))) {
              config->log_level = Y_LOG_LEVEL_WARNING;
            } else if (0 == strncmp("INFO", optarg, o_strlen("INFO"))) {
              config->log_level = Y_LOG_LEVEL_INFO;
            } else if (0 == strncmp("DEBUG", optarg, o_strlen("DEBUG"))) {
              config->log_level = Y_LOG_LEVEL_DEBUG;
            }
          } else {
            fprintf(stderr, "Error!\nNo log level specified\n");
            return 0;
          }
          break;
        case 'f':
          if (optarg != NULL) {
            o_free(config->log_file);
            if ((config->log_file = o_strdup(optarg)) == NULL) {
              fprintf(stderr, "Error allocating config->log_file, exiting\n");
              exit_server(&config, SADOK_STOP);
            }
          } else {
            fprintf(stderr, "Error!\nNo log file specified\n");
            return 0;
          }
          break;
        case 'h':
        case 'v':
				  print_help(stdout);
          exit_server(&config, SADOK_STOP);
          break;
      }

    } while (next_option != -1);

    // If none exists, exit failure
    if (config->config_file == NULL) {
      fprintf(stderr, "No configuration file found, please specify a configuration file path\n");
      return 0;
    }

    return 1;
  } else {
    return 0;
  }

}

/**
 * Initialize the application configuration based on the config file content
 * Read the config file, get mandatory variables and devices
 */
int build_config_from_file(struct config_elements * config) {

  config_t cfg;
  const char * str_value, * str_value_2, * cur_log_file = NULL, * one_log_mode;
  int int_value = 0, ret;
  char * file_content = NULL;

  config_init(&cfg);

  if (!config_read_file(&cfg, config->config_file)) {
    fprintf(stderr, "Error parsing config file %s\nOn line %d error: %s\n", config_error_file(&cfg), config_error_line(&cfg), config_error_text(&cfg));
    config_destroy(&cfg);
    ret = 0;
  } else {
    ret = 1;
    do {
      if (config_lookup_int(&cfg, "port", &int_value) == CONFIG_TRUE) {
        config->port = (uint)int_value;
      }

      if (config_lookup_string(&cfg, "api_prefix", &str_value) == CONFIG_TRUE) {
        o_free(config->api_prefix);
        if ((config->api_prefix = o_strdup(str_value)) == NULL) {
          fprintf(stderr, "Error setting config->api_prefix, exiting\n");
          ret = 0;
          break;
        }
      }

      if (config_lookup_string(&cfg, "allow_origin", &str_value) == CONFIG_TRUE) {
        if ((config->allow_origin = o_strdup(str_value)) == NULL) {
          fprintf(stderr, "Error setting config->allow_origin, exiting\n");
          ret = 0;
          break;
        }
      }

      if (config_lookup_string(&cfg, "log_mode", &str_value) == CONFIG_TRUE) {
        one_log_mode = strtok((char *)str_value, ",");
        while (one_log_mode != NULL) {
          if (0 == o_strncmp("console", one_log_mode, o_strlen("console"))) {
            config->log_mode |= Y_LOG_MODE_CONSOLE;
          } else if (0 == o_strncmp("syslog", one_log_mode, o_strlen("syslog"))) {
            config->log_mode |= Y_LOG_MODE_SYSLOG;
          } else if (0 == o_strncmp("file", one_log_mode, o_strlen("file"))) {
            config->log_mode |= Y_LOG_MODE_FILE;
            // Get log file path
            if (config_lookup_string(&cfg, "log_file", &cur_log_file)) {
              o_free(config->log_file);
              if ((config->log_file = o_strdup(cur_log_file)) == NULL) {
                fprintf(stderr, "Error allocating config->log_file, exiting\n");
                ret = 0;
                break;
              }
            }
          }
          one_log_mode = strtok(NULL, ",");
        }
      }

      if (config_lookup_string(&cfg, "log_level", &str_value) == CONFIG_TRUE) {
        if (0 == o_strncmp("NONE", str_value, o_strlen("NONE"))) {
          config->log_level = Y_LOG_LEVEL_NONE;
        } else if (0 == o_strncmp("ERROR", str_value, o_strlen("ERROR"))) {
          config->log_level = Y_LOG_LEVEL_ERROR;
        } else if (0 == o_strncmp("WARNING", str_value, o_strlen("WARNING"))) {
          config->log_level = Y_LOG_LEVEL_WARNING;
        } else if (0 == o_strncmp("INFO", str_value, o_strlen("INFO"))) {
          config->log_level = Y_LOG_LEVEL_INFO;
        } else if (0 == o_strncmp("DEBUG", str_value, o_strlen("DEBUG"))) {
          config->log_level = Y_LOG_LEVEL_DEBUG;
        }
      }

      if (config_lookup_bool(&cfg, "use_secure_connection", &int_value) == CONFIG_TRUE) {
        if (config_lookup_string(&cfg, "secure_connection_key_file", &str_value) == CONFIG_TRUE &&
            config_lookup_string(&cfg, "secure_connection_pem_file", &str_value_2) == CONFIG_TRUE) {
          config->use_secure_connection = (unsigned int)int_value;
          config->secure_connection_key_file = o_strdup(str_value);
          config->secure_connection_pem_file = o_strdup(str_value_2);
        } else {
          fprintf(stderr, "Error secure connection is active but certificate is not valid, exiting\n");
          ret = 0;
          break;
        }
      }

      if (config_lookup_string(&cfg, "data_file", &str_value) == CONFIG_TRUE) {
        if ((config->data_file = o_strdup(str_value)) == NULL) {
          fprintf(stderr, "Error setting config->data_file, exiting\n");
          ret = 0;
          break;
        }
      }

    } while (0);
    config_destroy(&cfg);
    o_free(file_content);
  }

  return ret;
}

/**
 * Print help message to output file specified
 */
void print_help(FILE * output) {
  fprintf(output, "\nSadok: e-book reader\n");
  fprintf(output, "\n");
  fprintf(output, "Version %s\n", _SADOK_VERSION_);
  fprintf(output, "\n");
  fprintf(output, "Copyright 2026 Nicolas Mora <mail@babelouest.org>\n");
  fprintf(output, "\n");
  fprintf(output, "This program is free software; you can redistribute it and/or\n");
  fprintf(output, "modify it under the terms of the GNU GENERAL PUBLIC LICENSE\n");
  fprintf(output, "License as published by the Free Software Foundation;\n");
  fprintf(output, "version 3 of the License.\n");
  fprintf(output, "\n");
  fprintf(output, "Command-line options:\n");
  fprintf(output, "\n");
  fprintf(output, "-c --config-file=PATH\n");
  fprintf(output, "\tPath to configuration file\n");
  fprintf(output, "-p --port=PORT\n");
  fprintf(output, "\tPort to listen to\n");
  fprintf(output, "-u --url-prefix=PREFIX\n");
  fprintf(output, "\tAPI URL prefix\n");
  fprintf(output, "-m --log-mode=MODE\n");
  fprintf(output, "\tLog Mode\n");
  fprintf(output, "\tconsole, syslog or file\n");
  fprintf(output, "\tIf you want multiple modes, separate them with a comma \",\"\n");
  fprintf(output, "\tdefault: console\n");
  fprintf(output, "-l --log-level=LEVEL\n");
  fprintf(output, "\tLog level\n");
  fprintf(output, "\tNONE, ERROR, WARNING, INFO, DEBUG\n");
  fprintf(output, "\tdefault: ERROR\n");
  fprintf(output, "-f --log-file=PATH\n");
  fprintf(output, "\tPath for log file if log mode file is specified\n");
  fprintf(output, "-h --help\n");
  fprintf(output, "-v --version\n");
  fprintf(output, "\tPrint this message\n\n");
}

/**
 * handles signal catch to exit properly when ^C is used for example
 * I don't like global variables but it looks fine to people who designed this
 */
void exit_handler(int signal) {
  y_log_message(Y_LOG_LEVEL_INFO, "Sadok caught a stop or kill signal (%d), exiting", signal);
  pthread_mutex_lock(&global_handler_close_lock);
  pthread_cond_signal(&global_handler_close_cond);
  pthread_mutex_unlock(&global_handler_close_lock);
}

/**
 * Check if all mandatory configuration parameters are present and correct
 * Initialize some parameters with default value if not set
 */
int check_config(struct config_elements * config) {
  int ret = 1;

  do {
    if (!config->port || config->port > 65535) {
      fprintf(stderr, "Invalid port number, exiting\n");
      ret = 0;
      break;
    }
    
    if (o_strnullempty(config->data_file)) {
      fprintf(stderr, "data_file missing, exiting\n");
      ret = 0;
      break;
    }

  } while (0);

  return ret;
}

/**
 *
 * Read the content of a file and return it as a char *
 * returned value must be free'd after use
 *
 */
char * get_file_content(const char * file_path) {
  char * buffer = NULL;
  size_t length, res;
  FILE * f;

  f = fopen (file_path, "rb");
  if (f) {
    fseek (f, 0, SEEK_END);
    length = (size_t)ftell (f);
    fseek (f, 0, SEEK_SET);
    buffer = o_malloc((length+1)*sizeof(char));
    if (buffer) {
      res = fread (buffer, 1, length, f);
      if (res != length) {
        fprintf(stderr, "fread warning, reading %zu while expecting %zu", res, length);
      }
      // Add null character at the end of buffer, just in case
      buffer[length] = '\0';
    }
    fclose (f);
  }

  return buffer;
}
