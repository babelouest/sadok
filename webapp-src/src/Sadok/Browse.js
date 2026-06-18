import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import profile from '../lib/Profile';

import apiManager from '../lib/APIManager';
import BrowseDir from './BrowseDir';
import BrowseFile from './BrowseFile';

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

const findBookProfileByUri = (bookProfiles, uri) => {
  let bp = false;
  Object.keys(bookProfiles).forEach(key => {
    if (bookProfiles[key].uri === uri) {
      bp = {...bookProfiles[key]};
    }
  });
  return bp;
};

export default function Browse({config, cbOpenBook, cbClose}) {
  const [ rootList, setRootList ] = useState([]);
  const [ list, setList ] = useState([]);
  const [ bookProfiles, seBookProfiles ] = useState([]);
  const [ filteredList, setFilteredList ] = useState(false);
  const [ breadcrumb, setBreadcrumb ] = useState([]);
  const [ filter, setFilter ] = useState("");

  useEffect(() => {
    apiManager.APIRequestExecute("list.json")
    .then(lst => {
      profile.getAllBookProfile()
      .then(bp => {
        seBookProfiles(bp);
      });
      setRootList(lst);
      setList(lst);
    })
    .catch(err => {
      console.error(err);
    });
  },[]);

  useEffect(() => {
    let pattern = filter.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    if (pattern) {
      let newFilteredList = [];
      list.forEach(l => {
        if (l.title.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(pattern)) {
          newFilteredList.push(l);
        }
      });
      setFilteredList(newFilteredList);
    } else {
      setFilteredList(false);
      setFilter("");
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

  let listDirJsx = [], listFilesJsx = [];
  if (filteredList) {
    filteredList.forEach((item, index) => {
      if (item.type === "dir") {
        listDirJsx.push (
          <BrowseDir key={item.title} item={item} cbOpenDir={cbOpenDir} />
        );
      } else {
        listFilesJsx.push (
          <BrowseFile key={item.title} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} />
        );
      }
    });
  } else {
    list.forEach((item, index) => {
      if (item.type === "dir") {
        listDirJsx.push (
          <BrowseDir key={item.title} item={item} cbOpenDir={cbOpenDir} />
        );
      } else {
        listFilesJsx.push (
          <BrowseFile key={item.title} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} />
        );
      }
    });
  }
  return (
    <>
      <div className="sticky-top">
        <div className="input-group mb-3">
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
        </div>
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder={i18next.t("browse-filter")} value={filter} onChange={changeFilter} />
        </div>
      </div>
      <div className="overflow-auto table-responsive">
        <table className="table table-striped">
          <thead className="">
            <tr>
              <th scope="col">
                {i18next.t("browse-filename")}
              </th>
              <th scope="col">
                {i18next.t("browse-size")}
              </th>
              <th scope="col">
                {i18next.t("browse-date")}
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
    </>
  );
}
