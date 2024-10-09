import useCheckAccess from '@/hooks/useCheckAccess';
import { unitName } from '@/services/base/constant';
import { Card, Col, Row } from 'antd';
import SoLuongVaoRaThuVienTheoThang from '../VaoRaThuVien/BaoCao/SoLuongTheoThang';
import './components/style.less';

const TrangChu = () => {
	// const accessTrangChu = useCheckAccess('thu-vien|trang-chu');
	// if (accessTrangChu)
	return (
		<>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<SoLuongVaoRaThuVienTheoThang />
				</Col>
			</Row>
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
