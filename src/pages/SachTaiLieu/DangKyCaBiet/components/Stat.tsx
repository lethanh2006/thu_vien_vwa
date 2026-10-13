import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatDanhSachDKCB = (props: { condition?: Partial<AnPham.IAnPhamXepGia> }) => {
	const intl = useIntl();
	const { condition } = props;
	const { thongKeDangKyCaBietModel, loadingThongKe, thongKeDKCB, soDKCBRanh } = useModel(
		'sachtailieu.anpham.anphamxepgia',
	);

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
						<span>{intl.formatMessage({ id: 'sachtailieu.anpham.tongDangKyCaBiet' })}</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'red' }}>
							{inputFormat(thongKeDKCB?.tongSoAnPhamDangThueMuon ?? 0)}
						</span>
						<span>{intl.formatMessage({ id: 'sachtailieu.anpham.soDKCBChoMuon' })}</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'green' }}>
							{inputFormat(soDKCBRanh ?? 0)}
						</span>
						<span>{intl.formatMessage({ id: 'sachtailieu.anpham.soDKCBKhaDung' })}</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatDanhSachDKCB;
