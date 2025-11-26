export const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: 12,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px rgba(59,130,246,0.2)"
        : "none",
      minHeight: 40,
      paddingLeft: 6,
      paddingRight: 6,
      transition: "all 150ms ease-in-out",
      background: "white",
      width: '200px'
    }),
  
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 6px",
    }),
  
    singleValue: (provided) => ({
      ...provided,
      color: "#111827",
      fontSize: 14,
    }),
  
    menu: (provided) => ({
      ...provided,
      borderRadius: 8,
      overflow: "hidden",
      marginTop: 4,
    }),
  
    menuList: (provided) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      maxHeight: 5 * 42,
      overflowY: "auto", 
      scrollbarWidth: "thin",
    }),
  
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#EFF6FF" : "white",
      color: "#111827",
      padding: 10,
      fontSize: 14,
    }),
};