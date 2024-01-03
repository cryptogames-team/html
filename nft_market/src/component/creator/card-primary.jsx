import React from "react";

export default function CardPrimary({ css, card_name, children }) {
  return (
    <>
      <div className={`card-primary p-3 lg:p-10 ${css}`}>
        {card_name ? <div className="text-xl mb-7">{card_name}</div> : null}
        {children}
      </div>
    </>
  );
}
