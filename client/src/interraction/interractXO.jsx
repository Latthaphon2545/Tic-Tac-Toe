

export const handleClick = (e, id, show, setValue) => {
  if (show === "X") {
    setValue("X");
  } else {
    setValue("O");
  }
  e.target.disabled = true;
};
