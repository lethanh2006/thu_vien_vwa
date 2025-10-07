import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatDanhSachDKCB = (props: { condition?: Partial<AnPham.IAnPhamXepGia> }) => {
	const { condition } = props;
	const { thongKeDangKyCaBietModel, loadingThongKe, thongKeDKCB } = useModel('sachtailieu.anpham.anphamxepgia');

	useEffect(() => {
		thongKeDangKyCaBietModel(condition);
	}, []);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							{inputFormat(thongKeDKCB?.tongSoAnPham ?? 0)}
						</span>
						<span>Tổng số đăng ký cá biệt</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'rec' }}>
							{inputFormat(thongKeDKCB?.tongSoAnPhamDangThueMuon ?? 0)}
						</span>
						<span>Số ĐKCB cho mượn</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'green' }}>
							{inputFormat((thongKeDKCB?.tongSoAnPham ?? 0) - (thongKeDKCB?.tongSoAnPhamDangThueMuon ?? 0))}
						</span>
						<span>Số ĐKCB khả dụng</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatDanhSachDKCB;
