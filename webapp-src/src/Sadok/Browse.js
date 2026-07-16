/**
 * 
 * Sadok e-book reader
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

import React, { useState, useEffect, useRef } from 'react';
import i18next from 'i18next';

import profile from '../lib/Profile';
import bookParser from '../lib/BookParser';

import apiManager from '../lib/APIManager';
import BrowseDir from './BrowseDir';
import BrowseFile from './BrowseFile';
import SortIcon from './SortIcon';
import BookInfo from './BookInfo';
import ChapterList from './ChapterList';
import Cover from './Cover';

const getSubDir = (list, breadcrumb) => {
  let subDir = [];
  list.forEach(l => {
    if (l.title === breadcrumb[0]) {
      if (breadcrumb.length > 1) {
        let newBC = [...breadcrumb].shift();
        subDir = getSubDir(l.content, [...breadcrumb].shift());
      } else {
        subDir = [...l.content];
      }
    }
  });
  return subDir;
};

const filterList = (list, filterPattern) => {
  let filteredList = [];
  list.forEach(elt => {
    if (elt.type === "dir") {
      filteredList = filteredList.concat(filterList(elt.content, filterPattern));
    } else {
      if (elt.title.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(filterPattern)) {
        filteredList.push(elt);
      }
    }
  });
  return filteredList;
};

const findBookProfileByUri = (bookProfiles, uri) => {
  let bp = false;
  Object.keys(bookProfiles).forEach(key => {
    if (bookProfiles[key].uri === uri) {
      bp = {...bookProfiles[key]};
    }
  });
  return bp;
};

const getOngoingOrComplete = (list, bookProfiles, complete) => {
  let onGoing = [];
  list.forEach(elt => {
    if (elt.type === "dir") {
      onGoing = onGoing.concat(getOngoingOrComplete(elt.content, bookProfiles, complete));
    } else  {
      let prof = findBookProfileByUri(bookProfiles, elt.url);
      if (prof && prof.offset !== undefined && prof.tokens !== undefined) {
        if (!complete && prof.offset < prof.tokens) {
          onGoing.push({...elt});
        } else if (complete && prof.offset >= prof.tokens) {
          onGoing.push({...elt});
        }
      }
    }
  });
  return onGoing;
};

const sortList = (list, column, asc) => {
  if (column === "title") {
    if (asc) {
      return [...list].sort((a, b) => (a.title.toLowerCase().localeCompare(b.title.toLowerCase())));
    } else {
      return [...list].sort((a, b) => (b.title.toLowerCase().localeCompare(a.title.toLowerCase())));
    }
  } else if (column === "size") {
    if (asc) {
      return [...list].sort((a, b) => a.size - b.size);
    } else {
      return [...list].sort((a, b) => b.size - b.size);
    }
  } else if (column === "date") {
    if (asc) {
      return [...list].sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());
    } else {
      return [...list].sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
    }
  } else {
    return list;
  }
};

export default function Browse({config, cbOpenBook, cbOpenBookByContent, cbClose}) {
  const [ rootList, setRootList ] = useState([]);
  const [ list, setList ] = useState([]);
  const [ ongoingList, setOngoingList ] = useState(false);
  const [ completeList, setCompleteList ] = useState(false);
  const [ bookProfiles, seBookProfiles ] = useState([]);
  const [ filteredList, setFilteredList ] = useState(false);
  const [ breadcrumb, setBreadcrumb ] = useState([]);
  const [ filter, setFilter ] = useState("");
  const [ orderColumn, setOrderColumn ] = useState("title");
  const [ orderAsc, setOrderAsc ] = useState(true);
  const [ show, setShow ] = useState(true);
  const [ viewBook, setViewBook ] = useState(false);
  const [ viewBookInfo, setViewBookInfo ] = useState(false);
  const [ viewBookCoverData, setviewBookCoverData ] = useState(false);
  const [ errorList, setErrorList ] = useState(false);
  const inputFile = useRef(null);

  useEffect(() => {
    apiManager.APIRequestExecute("list.json")
    .then(lst => {
      if (Array.isArray(lst)) {
        profile.getAllBookProfile()
        .then(bp => {
          seBookProfiles(bp);
        });
        setRootList(lst);
        setList(lst);
        setErrorList(false);
      } else {
        setErrorList(true);
      }
    })
    .catch(err => {
      console.error(err);
      setErrorList(true);
    });
  },[]);

  useEffect(() => {
    let pattern = filter.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    if (pattern) {
      setFilteredList(filterList(list, pattern));
    } else {
      setFilteredList(false);
    }
  },[filter]);

  const cbOpenDir = (dir) => {
    let bc = [...breadcrumb];
    bc.push(dir);
    setBreadcrumb(bc);
    let subList = [];
    list.forEach(l => {
      if (l.title === dir) {
        subList = [...l.content];
      }
    });
    setList(subList);
    setFilteredList(false);
    setFilter("");
  };

  const openRelPath = (e, indexPath) => {
    e.preventDefault();
    if (indexPath === -1) {
      setList(rootList);
      setBreadcrumb([]);
    } else {
      let newBreadcrumb = [...breadcrumb];
      let origPath = newBreadcrumb[indexPath+1];
      newBreadcrumb.length = indexPath+1;
      setList(getSubDir(rootList, newBreadcrumb));
      setBreadcrumb(newBreadcrumb);
      setFilteredList(false);
      setFilter("");
    }
  };

  const changeFilter = (e) => {
    setFilter(e.target.value);
  };

  const toggleOngoing = () => {
    if (!ongoingList) {
      setOngoingList(getOngoingOrComplete(list, bookProfiles, false));
    } else {
      setOngoingList(false);
    }
  };

  const toggleComplete = () => {
    if (!completeList) {
      setCompleteList(getOngoingOrComplete(list, bookProfiles, true));
    } else {
      setCompleteList(false);
    }
  };

  const changeShow = (e, val) => {
    e.preventDefault();
    setShow(val);
  };

  const changeOrder = (e, order) => {
    e.preventDefault();
    if (order === orderColumn) {
      setOrderAsc(!orderAsc);
    } else {
      setOrderColumn(order);
      setOrderAsc(true);
    }
  };

  const cbViewBook = (bookItem) => {
    let prom = false;
    if (bookItem.type === "epub") {
      prom = bookParser.parseEpub(bookItem.url);
    } else if (bookItem.type === "pdf") {
    } else if (bookItem.type === "txt") {
      prom = bookParser.parseTxt(bookItem.url)
    }
    if (prom) {
      return prom.then(bookParsed => {
        if (bookParsed.book?.resources?.cover) {
          bookParsed.book.loadBlob(bookParsed.book.resources.cover.href)
          .then(res => {
            const reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onloadend = () => {
              const dataUrlPrefix = `data:${bookParsed.book.resources.cover.mediaType};base64,`;
              setviewBookCoverData(dataUrlPrefix+reader.result.split(",")[1]);
            };
          });
        } else {
          setviewBookCoverData(false);
        }
        setViewBookInfo(bookParsed);
        setViewBook(true);
      });
    }
  };

  const cbCloseViewBook = () => {
    setViewBook(false);
  };

  const openLocalFile = (e) => {
    let file = e.target.files[0];
    let fr = new FileReader();
    if (e.target.files[0].type.startsWith("application/pdf") || e.target.files[0].name.toLowerCase().endsWith(".pdf")) {
      // Load as pdf
      fr.onload = (ev2) => {
        cbOpenBookByContent("file://" + e.target.files[0].name, "pdf", ev2.target.result);
      };
      fr.readAsArrayBuffer(file);
    } else if (e.target.files[0].type.startsWith("application/epub") || e.target.files[0].name.toLowerCase().endsWith(".epub")) {
      fr.onload = (ev2) => {
        // Load as ePub
        cbOpenBookByContent("file://" + e.target.files[0].name, "epub", ev2.target.result);
      };
      fr.readAsArrayBuffer(file);
    } else {
      fr.onload = (ev2) => {
        // Load as text
        if ((typeof ev2.target.result) === "string") {
          cbOpenBookByContent("file://" + e.target.files[0].name, "txt", ev2.target.result);
        }
      };
      fr.readAsText(file);
    }
  };

  if (viewBook) {
    return (
      <>
        <Cover coverData={viewBookCoverData} opacity={"50"} showCover={true} />
        <div className="m-3">
          <button className="btn btn-secondary" type="button" title={i18next.t("close")} onClick={cbCloseViewBook}>
            <img src="img/close_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
          </button>
        </div>
        <div className="mb-3">
          <BookInfo book={viewBookInfo} config={config} />
        </div>
        <div className="mb-3 opacity-75">
          <ChapterList book={viewBookInfo} config={config} offset={-1} cbSetOffset={false} />
        </div>
      </>
    );
  } else {
    let listDirJsx = [], listFilesJsx = [];
    if (completeList) {
      sortList(completeList, orderColumn, orderAsc).forEach((item, index) => {
        listFilesJsx.push (
          <BrowseFile key={index+item.url} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} cbViewBook={cbViewBook} />
        );
      });
    } else if (ongoingList) {
      sortList(ongoingList, orderColumn, orderAsc).forEach((item, index) => {
        listFilesJsx.push (
          <BrowseFile key={index+item.url} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} cbViewBook={cbViewBook} />
        );
      });
    } else if (filteredList) {
      sortList(filteredList, orderColumn, orderAsc).forEach((item, index) => {
        listFilesJsx.push (
          <BrowseFile key={index+item.url} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} cbViewBook={cbViewBook} />
        );
      });
    } else {
      sortList(list, orderColumn, orderAsc).forEach((item, index) => {
        if (item.type === "dir" && (show === true || show === "folders")) {
          listDirJsx.push (
            <BrowseDir key={index+item.title} item={item} cbOpenDir={cbOpenDir} />
          );
        } else if (item.type !== "dir" && (show === true || show === "files")) {
          listFilesJsx.push (
            <BrowseFile key={index+item.url} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} cbViewBook={cbViewBook} />
          );
        }
      });
    }
    if (errorList) {
      return (
        <>
          <div className="m-3">
            <button className="btn btn-secondary" type="button" title={i18next.t("close")} onClick={cbClose}>
              <img src="img/close_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
            </button>
          </div>
          <div className="m-3">
            <button className="btn btn-secondary" type="button" title={i18next.t("browse-open-local-file")} onClick={() => inputFile.current.click()} >
              <img src="img/upload_file_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
            </button>
          </div>
          <input type="file"
                 className="upload"
                 ref={inputFile}
                 onChange={openLocalFile} />
        </>
      );
    } else {
      return (
        <>
          <div className="sticky-top">
            <div className="m-3">
              <button className="btn btn-secondary" type="button" title={i18next.t("close")} onClick={cbClose}>
                <img src="img/close_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
              </button>
            </div>
            <div className="m-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#" onClick={(e) => openRelPath(e, -1)}>{i18next.t("browse-root")}</a></li>
                  {
                    breadcrumb.map((bc, i) => {
                      if (i < breadcrumb.length-1) {
                        return (
                          <li className="breadcrumb-item" key={i}><a href="#" onClick={(e) => openRelPath(e, i)}>{bc}</a></li>
                        );
                      } else {
                        return (
                          <li className="breadcrumb-item" key={i}>{bc}</li>
                        );
                      }
                    })
                  }
                </ol>
              </nav>
            </div>
            <div className="input-group mb-3">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={completeList || filteredList}>{i18next.t("browse-show")}</button>
              <ul className="dropdown-menu">
                <li><a className={"dropdown-item"+(show===true?" active":"")} href="#" onClick={(e) => changeShow(e, false)}>{i18next.t("browse-show-all")}</a></li>
                <li><a className={"dropdown-item"+(show==="files"?" active":"")} href="#" onClick={(e) => changeShow(e, "files")}>{i18next.t("browse-show-files")}</a></li>
                <li><a className={"dropdown-item"+(show==="folders"?" active":"")} href="#" onClick={(e) => changeShow(e, "folders")}>{i18next.t("browse-show-folders")}</a></li>
              </ul>
              <input type="text" className="form-control" placeholder={i18next.t("browse-filter")} value={filter} onChange={changeFilter} disabled={ongoingList || completeList} />
              <button className="btn btn-secondary" type="button" title={i18next.t("browse-ongoing")} onClick={toggleOngoing} disabled={completeList || filteredList} >
                <img src="img/book_5_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
              </button>
              <button className="btn btn-secondary" type="button" title={i18next.t("browse-done")} onClick={toggleComplete} disabled={ongoingList || filteredList} >
                <img src="img/check_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
              </button>
              <button className="btn btn-secondary" type="button" title={i18next.t("browse-open-local-file")} onClick={() => inputFile.current.click()} >
                <img src="img/upload_file_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
              </button>
            </div>
          </div>
          <div className="overflow-auto table-responsive">
            <table className="table table-striped">
              <thead className="">
                <tr>
                  <th scope="col">
                    <a href="#" onClick={(e) => changeOrder(e, "title")}>
                      {i18next.t("browse-filename")}
                      <SortIcon column={orderColumn==="title"} asc={orderAsc} />
                    </a>
                  </th>
                  <th scope="col">
                    <a href="#" onClick={(e) => changeOrder(e, "size")}>
                      {i18next.t("browse-size")}
                      <SortIcon column={orderColumn==="size"} asc={orderAsc} />
                    </a>
                  </th>
                  <th scope="col">
                    <a href="#" onClick={(e) => changeOrder(e, "date")}>
                      {i18next.t("browse-date")}
                      <SortIcon column={orderColumn==="date"} asc={orderAsc} />
                    </a>
                  </th>
                  <th scope="col">
                  </th>
                </tr>
              </thead>
              <tbody>
                {listDirJsx}
                {listFilesJsx}
              </tbody>
            </table>
          </div>
          <input type="file"
                 className="upload"
                 ref={inputFile}
                 onChange={openLocalFile} />
        </>
      );
    }
  }
}
