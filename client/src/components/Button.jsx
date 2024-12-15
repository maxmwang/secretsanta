import React from 'react';
import cx from 'classnames';

export function BigButton({ children, className, disabled, important, type, onClick }) {
  return (
    <button
      disabled={disabled}
      className={cx(
        className,
        important ? "bg-red-500 hover:bg-red-400" : "bg-blue-500 hover:bg-blue-400",
        {"shadow-md": !disabled},
        {"bg-opacity-50 hover:bg-opacity-50": disabled},
        "px-8 py-2 font-semibold text-white transition duration-300 ease-in-out transform rounded-md hover:shadow-none focus:outline-none",
      )}
      onClick={onClick}
      type={type}
    >
      <span className="tracking-tighter">
        {children}
      </span>
    </button>
  );
}

export function SmallButton({ children, className, disabled, important, type, onClick }) {
  return (
    <small>
      <button
        disabled={disabled}
        className={cx(
          className,
          important ? "bg-red-500 hover:bg-red-400" : "bg-blue-500 hover:bg-blue-400",
          "px-2 py-1 text-white transition duration-300 ease-in-out transform rounded-md shadow-md hover:shadow-none focus:outline-none",
          {"opacity-50 cursor-auto": disabled},
        )}
        onClick={onClick}
        type={type}
      >
        <span className="tracking-tighter">
          {children}
        </span>
      </button>
    </small>
  );
}

export function TextButton({ children, className, onClick }) {
  return (
    <p className={cx(className, "cursor-pointer text-blue-400 border-b-2 hover:border-blue-400 border-transparent inline-block")} onClick={onClick}>{children}</p>
  );
}
