import React from "react";
import PropTypes from "prop-types";
import "./App.css";
import { CheckboxField } from "@livechat/design-system";
import prettyBytes from "pretty-bytes";
import { folderIcon } from "./constants";

const FileItem = ({ name, isDir, icon, link, bytes, onClick, isChecked }) => {
  const iconUrl = isDir ? folderIcon : icon;
  const sizeLabel = isDir ? "Folder" : prettyBytes(bytes);

  return (
    <div className="File-card" onClick={onClick(name)}>
      <div className="File-card__checkbox">
        <CheckboxField checked={isChecked(name)} />
      </div>
      <img className="File-card__icon__img" src={iconUrl} alt={name} />
      <div className="File-card__name">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </div>
      <div className="File-card__bytes">{sizeLabel}</div>
    </div>
  );
};

FileItem.propTypes = {
  name: PropTypes.string,
  isDir: PropTypes.bool,
  icon: PropTypes.string,
  link: PropTypes.string,
  bytes: PropTypes.number,
  onClick: PropTypes.func,
  isChecked: PropTypes.func
};

FileItem.displayName = "FileItem";

const RecentFilesList = ({ items, isChecked, onClick }) =>
  items.map(file => (
    <FileItem
      {...file}
      isChecked={isChecked}
      onClick={onClick}
      key={file.name}
    />
  ));

RecentFilesList.propTypes = {
  items: PropTypes.array,
  isChecked: PropTypes.func,
  onClick: PropTypes.func
};

RecentFilesList.displayName = "RecentFilesList";

export default RecentFilesList;
