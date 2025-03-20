// src/components/FilterDropdown.jsx
import React from "react";
import { IoClose } from "react-icons/io5";

const FilterDropdown = ({ label, options, selected, onChange }) => {
	const handleOptionClick = (value) => {
		onChange(value);
		// ปิด dropdown โดยการลบ focus ออกจากปุ่ม label
		document.activeElement.blur();
	};

	const handleResetClick = () => {
		onChange(""); // ล้างตัวเลือก
		// ปิด dropdown
		document.activeElement.blur();
	};

	return (
		<div className="dropdown dropdown-bottom gap-1 flex items-center w-full">
			<label
				tabIndex={0}
				className="btn btn-outline bg-black border-none rounded text-white hover:bg-gray-800 w-full truncate "
				style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 300 }}
			>
				{selected ? `${label}: ${selected}` : label}
			</label>
			{selected && (
				<button
					onClick={handleResetClick}
					className="text-white bg-black hover:text-gray-100 hover:bg-gray-800 hover:cursor-pointer"
					aria-label="Reset filter"
				>
					<IoClose size={16} />
				</button>
			)}
			<ul
				tabIndex={0}
				className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10 "
			>
				<li>
					<a onClick={() => handleOptionClick("")}>All</a>
				</li>
				{options.map((option, index) => (
					<li key={index}>
						<a onClick={() => handleOptionClick(option)}>{option}</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FilterDropdown;
