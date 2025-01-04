import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const StatAnPham = () => {
	const { getThongKeAnPhamModel, loadingThongKe } = useModel('sachtailieu.anpham.anpham');
	const [recThongKe, setRecThongKe] = useState<AnPham.IThongKeAnPham>();

	useEffect(() => {
		getThongKeAnPhamModel().then((res) => setRecThongKe(res));
	}, []);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							{inputFormat(recThongKe?.tongSoAnPham ?? 0)}
						</span>
						<span>Tổng số ấn phẩm</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'orange' }}>
							{inputFormat(recThongKe?.tongAnPham ?? 0)}
						</span>
						<span>Tổng đăng ký cá biệt</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'rec' }}>
							{inputFormat(recThongKe?.tongAnPhamDangThueMuon ?? 0)}
						</span>
						<span>Số ĐKCB cho mượn</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'green' }}>
							{inputFormat((recThongKe?.tongAnPham ?? 0) - (recThongKe?.tongAnPhamDangThueMuon ?? 0))}
						</span>
						<span>Số ĐKCB khả dụng</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatAnPham;
