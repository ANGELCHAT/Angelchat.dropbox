import React, { useState, useEffect } from "react";
import { Button, Loader } from "@livechat/design-system";
import { createMessageBoxWidget } from "@livechat/agent-app-sdk";
import uniqBy from "lodash.uniqby";
import includes from "lodash.includes";

import { buildRichMessageWithFiles } from "./helpers";
import { useStateWithLocalStorage } from "./hooks";
import { LOADING, EMPTY_STATE, RECENT_FILES, TWO_HOURS } from "./constants";

import "./App.css";
import RecentFilesList from "./RecentFilesList";

function App() {
  const Dropbox = window.Dropbox || {};
  const [currentAppState, setAppState] = useState(LOADING);
  const [widgetInstance, setWidgetInstance] = useState({});
  const [recentFiles, setRecentFiles] = useStateWithLocalStorage(
    "recentFiles",
    []
  );
  const [selectedFiles, selectFiles] = useStateWithLocalStorage(
    "recentlySelectedFiles",
    []
  );

  const handleDropboxOpen = () =>
    Dropbox.choose &&
    Dropbox.choose({
      folderselect: true,
      multiselect: true,
      success: handleDropboxSelect
    });

  const handleDropboxSelect = files => {
    // Dropbox thumbnails expire in 4hrs - let's keep the timestamp
    files = files.map(file => ({ ...file, timestamp: Date.now() }));
    setRecentFiles(uniqBy([...files, ...recentFiles], "name"));
    selectFiles(files.map(({ name }) => name));
    setAppState(RECENT_FILES);
  };

  const isSelected = name => includes(selectedFiles, name);
  const getSelectedFiles = () =>
    recentFiles.filter(({ name }) => includes(selectedFiles, name));

  const toggleFile = name => () => {
    if (isSelected(name)) {
      selectFiles([...selectedFiles.filter(item => item !== name)]);
    } else {
      selectFiles([name, ...selectedFiles]);
    }
  };

  const clearRecentFiles = () => {
    setAppState(LOADING);
    setRecentFiles([]);
    selectFiles([]);
  };

  const clearExpiredRecentFiles = () => {
    setRecentFiles(
      recentFiles.filter(file => Date.now() - file.timestamp < TWO_HOURS)
    );
    selectFiles(getSelectedFiles().map(file => file.name));
  };

  // fires just once, on init
  useEffect(() => {
    clearExpiredRecentFiles();
    createMessageBoxWidget().then(widget => {
      setWidgetInstance(widget);
    });
    // eslint-disable-next-line
  }, []);

  // fires when recent files list change
  useEffect(() => {
    if (recentFiles.length > 0) {
      setAppState(RECENT_FILES);
    } else {
      setAppState(EMPTY_STATE);
    }
  }, [recentFiles]);

  // fires every time the selected files change
  useEffect(() => {
    widgetInstance.putMessage &&
      widgetInstance.putMessage(buildRichMessageWithFiles(getSelectedFiles()));
    // eslint-disable-next-line
  }, [widgetInstance, selectedFiles]);

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
    case RECENT_FILES:
      return (
        <div className="App">
          <div className="App-header">
            <div>
              {selectedFiles.length > 0
                ? `You selected ${selectedFiles.length} item${
                    selectedFiles.length > 1 ? "s" : ""
                  } for sending`
                : "Pick from recently selected items"}
            </div>
            <a href="#browse" onClick={handleDropboxOpen}>
              Browse Dropbox
            </a>
          </div>
          <RecentFilesList
            items={recentFiles}
            isChecked={isSelected}
            onClick={toggleFile}
          />
          <div className="App-footer">
            <a href="#clear" onClick={clearRecentFiles}>
              Clear this list
            </a>
          </div>
        </div>
      );
    default:
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
  }
}

export default App;
