import React, { useState } from "react";
import "./App.css";
import { Button, Loader } from "@livechat/design-system";
import { createMessageBoxWidget } from "@livechat/agent-app-sdk";
import uniqBy from "lodash.uniqby";
import includes from "lodash.includes";

import RecentFilesList from "./RecentFileList";
import { buildRichMessageWithFiles } from "./helpers";
import { useLocalStorageAndState } from "./hooks";

import { LOADING, EMPTY_STATE, RECENT_FILES } from "./constants";

function App() {
  const Dropbox = window.Dropbox || {};

  const [widgetInstance, setWidgetInstance] = useState({});
  const [currentAppState, setAppState] = useState(LOADING);

  const [recentFiles, setRecentFiles] = useLocalStorageAndState(
    "recentFiles",
    []
  );
  const [selectedFiles, selectFiles] = useState([
    recentFiles[0] && recentFiles[0].name
  ]);

  createMessageBoxWidget().then(widget => {
    setWidgetInstance(widget);
    if (recentFiles.length > 0) {
      setAppState(RECENT_FILES);
    } else {
      setAppState(EMPTY_STATE);
    }
  });

  const putRichMessage = () => {
    widgetInstance.putMessage &&
      widgetInstance.putMessage(
        buildRichMessageWithFiles(
          recentFiles.filter(({ name }) => includes(selectedFiles, name))
        )
      );
  };

  putRichMessage();

  const clearRecentFiles = () => {
    setRecentFiles([]);
    setAppState(EMPTY_STATE);
  };

  const handleDropboxSelect = files => {
    putRichMessage();
    selectFiles(files.map(({ name }) => name));
    setAppState(RECENT_FILES);

    let cache = [...recentFiles];
    cache = files.concat(cache);
    setRecentFiles(uniqBy(cache, "name"));
  };

  const handleDropboxOpen = () =>
    Dropbox.choose &&
    Dropbox.choose({
      folderselect: true,
      multiselect: true,
      success: handleDropboxSelect
    });

  const isSelected = name => includes(selectedFiles, name);

  const toggleFile = name => () => {
    if (isSelected(name)) {
      selectFiles([...selectedFiles.filter(item => item !== name)]);
    } else {
      selectFiles([name, ...selectedFiles]);
    }
    putRichMessage(selectedFiles);
  };

  switch (currentAppState) {
    case LOADING:
      return (
        <div className="App">
          <div className="App-center">
            <Loader size="medium" />
            <p>Loading...</p>
          </div>
        </div>
      );
    case EMPTY_STATE:
      return (
        <div className="App">
          <div className="App-center">
            <p>
              Browse your Dropbox and choose
              <br />
              which files or folders you want to send.
            </p>
            <Button onClick={handleDropboxOpen}>Browse Dropbox</Button>
          </div>
        </div>
      );
    case RECENT_FILES:
      return (
        <div className="App">
          <div className="App-header">
            <div>Recently selected</div>
            <a href="#" onClick={handleDropboxOpen}>
              Browse Dropbox
            </a>
          </div>
          <RecentFilesList
            items={recentFiles}
            isChecked={isSelected}
            onClick={toggleFile}
          />
          <div className="App-footer">
            <a href="#" onClick={clearRecentFiles}>
              Clear this list
            </a>
          </div>
        </div>
      );
  }
}

export default App;
