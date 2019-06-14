import posed from "react-pose";

const View = posed.div({
  enter: { y: 0, opacity: 1, delay: 300, transition: { duration: 250 } },
  exit: {
    opacity: 0,
    transition: { duration: 150 }
  }
});

View.displayName = "View";

export default View;
