import Link from "next/link";
import Navbar0 from "./customs/navbar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
export default function Navbar() {
	function Navbar1() {
		return (
			<AppBar>
				<Toolbar>
					<Link href="/">
						<IconButton
							edge="start"
							aria-label="home"
							href="/"
							style={{ color: `white`, fontSize: "200%" }}
						>
							เว็บชุมชนสมุนไพรไทย
						</IconButton>
					</Link>
					<Link href="/">
						<IconButton style={{ color: `white`, margin: "0 0 0 500px" }}>
							<Typography>หน้าแรก</Typography>
						</IconButton>
					</Link>
					<Link href="/search">
						<IconButton style={{ color: `white` }}>
							<Typography>ค้นหา</Typography>
						</IconButton>
					</Link>
					<Link href="/qanda">
						<IconButton style={{ color: `white` }}>
							<Typography>ถาม-ตอบ</Typography>
						</IconButton>
					</Link>
					<Link href="/signup">
						<IconButton style={{ color: `white` }}>
							<Typography>ลงทะเบียน</Typography>
						</IconButton>
					</Link>
					<Link href="/signin">
						<IconButton style={{ color: `white` }}>
							<Typography>ลงชื่อใช้งาน</Typography>
						</IconButton>
					</Link>
				</Toolbar>
			</AppBar>
		);
	}
	return (
		<React.Fragment>
			<Navbar0 />
		</React.Fragment>
	);
}
