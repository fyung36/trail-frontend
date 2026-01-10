import React, { ChangeEvent } from "react";
import { SearchOutlined } from "@ant-design/icons";
interface Props {
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  filterText?: string;
  value?: string;
}

const FormFilter = ({ placeholder, onChange, filterText, value }: Props) => {
  // Use value prop if provided, otherwise use filterText as controlled value
  const inputValue = value !== undefined ? value : filterText;

  return (
    <form className="search_form" style={{ marginBottom: "0" }}>
      <input
        type="text"
        className="search_input"
        placeholder={placeholder}
        onChange={onChange}
        value={inputValue || ""}
      />
      <SearchOutlined className="search_icon" />
    </form>
  );
};

export default FormFilter;
