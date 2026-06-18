#
# Sadok e-book reader
#
# Makefile used to build the software
#
# Copyright 2024-2025 Nicolas Mora <mail@babelouest.org>
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU GENERAL PUBLIC LICENSE
# License as published by the Free Software Foundation;
# version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU GENERAL PUBLIC LICENSE for more details.
#
# You should have received a copy of the GNU General Public
# License along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

CC=gcc
#CC=clang
CFLAGS=-c -Wall -Werror -Wextra -Wconversion -Wpedantic $(ADDITIONALFLAGS)
LIBS=-lc -lulfius -lyder -ljansson -lorcania -lhoel -lconfig -lpthread
OBJECTS=sadok.o
PREFIX=/usr/local
CONFIG_FILE=./sadok.conf

all: release

clean:
	rm -f *.o sadok valgrind.txt

debug: ADDITIONALFLAGS=-DDEBUG -g -O0

debug: sadok

release: ADDITIONALFLAGS=-O3

release: sadok

%.o: %.c sadok.h
	$(CC) $(CFLAGS) $<

sadok: $(OBJECTS)
	$(CC) -o $@ $^ $(LIBS)

memcheck: debug
	valgrind --tool=memcheck --leak-check=full --show-leak-kinds=all ./sadok --config-file=$(CONFIG_FILE) 2>valgrind.txt

test-debug: debug
	./sadok --config-file=$(CONFIG_FILE)

install: sadok
	cp -f sadok $(PREFIX)/bin
