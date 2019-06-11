import React from "react";
import "./App.css";
import { CheckboxField } from "@livechat/design-system";
import prettyBytes from "pretty-bytes";
import { folderIcon } from "./constants";

const FileItem = ({ name, isDir, icon, link, bytes, onClick, isChecked }) => (
  <div className="File-card" onClick={onClick(name)}>
    <div className="File-card__checkbox">
      <CheckboxField checked={isChecked(name)} />
    </div>

    <img className="File-card__icon__img" src={isDir ? folderIcon : icon} />

    <div className="File-card__name">
      <a href={link} target="_blank">
        {name}
      </a>
    </div>
    <div className="File-card__bytes">
      {isDir ? "Folder" : prettyBytes(bytes)}
    </div>
  </div>
);

const RecentFilesList = ({ items, isChecked, onClick }) =>
  items.map(file => (
    <FileItem
      {...file}
      isChecked={isChecked}
      onClick={onClick}
      key={file.name}
    />
  ));

export default RecentFilesList;
