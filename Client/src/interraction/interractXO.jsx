// interractXO

export const handleClick = (e, id, show, setValue) => {
  // console.log(e.target);
  // console.log(id);
  // console.log(show);
  if (show === "X") {
    setValue("X");
  } else {
    setValue("O");
  }
  e.target.disabled = true;
};
