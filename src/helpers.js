import prettyBytes from "pretty-bytes";
import { folderIcon } from "./constants";

export const buildRichMessageWithFiles = files => {
  return (
    files.length > 0 && {
      template_id: "cards",
      elements: files.map(
        ({ name, isDir, bytes, link, thumbnailLink, icon }) => ({
          title: name,
          subtitle: isDir
            ? "Folder hosted at Dropbox"
            : `${prettyBytes(bytes)} file hosted at Dropbox`,
          buttons: [
            {
              text: "Open in Dropbox",
              type: "url",
              value: link,
              postback_id: "action_open",
              user_ids: [""]
            }
          ],
          image: {
            url: isDir
              ? folderIcon
              : thumbnailLink
              ? `${thumbnailLink}&bounding_box=800&mode=fit_one_and_overflow`
              : icon
          }
        })
      )
    }
  );
};
