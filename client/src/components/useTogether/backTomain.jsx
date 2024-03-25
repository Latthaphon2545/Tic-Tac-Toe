import React from 'react'

export default function BackTomain() {
  return (
    <div>
      <h3
        onClick={() => {
          window.location.href = "/main";
        }}
        style={{ color: "white", cursor: "pointer" }}
      >
        Back to main menu
      </h3>
    </div>
  );
}
