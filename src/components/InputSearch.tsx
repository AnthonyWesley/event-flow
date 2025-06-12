import React, { forwardRef, useState } from "react";

type InputSearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  (props, ref) => {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isOpen = isFocused || isHovered || value.length > 0;

    return (
      <div
        className={`flex h-[60px] items-center overflow-hidden rounded-full bg-slate-900 p-5 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] duration-300 ${
          isOpen ? "w-[270px]" : "w-[60px]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-center fill-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Isolation_Mode"
            data-name="Isolation Mode"
            viewBox="0 0 24 24"
            width="22"
            height="22"
          >
            <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"></path>
          </svg>
        </div>
        <input
          type="text"
          className="w-full bg-transparent px-4 text-[20px] font-normal text-white outline-none"
          {...props}
          ref={ref}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange?.(e);
          }}
        />
      </div>
    );
  },
);

export default InputSearch;
