import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import SoLuongVaoRaThuVienTheoThang from '../VaoRaThuVien/BaoCao/SoLuongTheoThang';
import SoLuongTopVaoRaThuVien from '../VaoRaThuVien/BaoCao/SoLuongTopThuVien';
import './components/style.less';

const TrangChu = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('65%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	// const accessTrangChu = useCheckAccess('thu-vien|trang-chu');
	// if (accessTrangChu)
	return (
		<>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='40%'>
					<SoLuongVaoRaThuVienTheoThang />
				</Pane>
				<Pane minSize='20%'>
					<SoLuongTopVaoRaThuVien />
				</Pane>
			</SplitPane>
		</>
	);

	// return (

	// 	<Card bodyStyle={{ height: '100%' }}>
	// 		<div className='home-welcome'>
	// 			<h1 className='title'>PHÂN HỆ THƯ VIỆN</h1>
	// 			<h2 className='sub-title'>HỆ THỐNG CHUYỂN ĐỔI SỐ - {unitName.toUpperCase()}</h2>
	// 		</div>
	// 	</Card>
	// );
};

export default TrangChu;
