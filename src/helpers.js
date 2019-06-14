import prettyBytes from "pretty-bytes";
import { folderIcon } from "./constants";

export const buildRichMessageWithFiles = files => {
  // keep in mind default icons provided by Dropbox are tiny (64x64);
  // also Dropbox thumbnails expire in 4 hours
  const makeImgUrl = thumbnailLink =>
    thumbnailLink
      ? `${thumbnailLink}&bounding_box=800&mode=fit_one_and_overflow`
      : folderIcon;

  const makeSubtitle = (isDir, bytes) =>
    isDir
      ? "Folder hosted at Dropbox"
      : `${prettyBytes(bytes)} file hosted at Dropbox`;

  const buttonLabel = "Open in Dropbox";

  return (
    files.length > 0 && {
      template_id: "cards",
      elements: files.map(({ name, isDir, bytes, link, thumbnailLink }) => ({
        title: name,
        subtitle: makeSubtitle(isDir, bytes),
        buttons: [
          {
            text: buttonLabel,
            type: "url",
            value: link,
            postback_id: "action_open",
            user_ids: [""]
          }
        ],
        image: {
          url: makeImgUrl(thumbnailLink)
        }
      }))
    }
  );
};
