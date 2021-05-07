import React from "react";
import Search from "material-ui-search-bar";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
	return (
		<>
			<form>
				<div style={{ display: "inline" }}>
					<Search
						fullWidth
						variant="outlined"
						value={searchQuery}
						onInput={(e) => setSearchQuery(e.target.value)}
						placeholder="ค้นหา"
					/>
				</div>
			</form>
		</>
	);
};

export default SearchBar;
