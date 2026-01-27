import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatThongKeMuonTra = (props: { filter?: any; trangThai: ETrangThaiMuonSach }) => {
	const { filter, trangThai } = props;
	const { thongKeTongSoMuonTraAnPhamModel, loadingThongKe, dataTheMuonAnPham } =
		useModel('sachtailieu.muontra.muontra');

	const intl = useIntl();

	useEffect(() => {
		thongKeTongSoMuonTraAnPhamModel(undefined, filter?.filter(Boolean)?.length ? filter?.filter(Boolean) : undefined);
	}, [JSON.stringify(filter)]);

	const renderCard = (value: number, color: string, title: string, description: string) => (
		<Tooltip title={description}>
			<Card className='card-stat-small'>
				<span className='num' style={{ color }}>
					{inputFormat(value)}
				</span>
				<span>{title}</span>
			</Card>
		</Tooltip>
	);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				{/* <Col span={24} md={6}>
					{renderCard(dataTheMuonAnPham?.tongSoLuot ?? 0, 'blue', 'Tổng số', 'Thống kê tổng số ghi mượn/ghi trả')}
				</Col> */}
				<Col span={24} md={8}>
					{renderCard(
						dataTheMuonAnPham?.theoDkcb ?? 0,
						'orange',
						intl.formatMessage({ id: 'sachtailieu.thongke.stat.theodkcb' }),
						intl.formatMessage({
							id:
								trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
									? 'sachtailieu.thongke.stat.tooltip.theodkcb.muon'
									: 'sachtailieu.thongke.stat.tooltip.theodkcb.tra',
						}),
					)}
				</Col>
				<Col span={24} md={8}>
					{renderCard(
						dataTheMuonAnPham?.theoBanDoc ?? 0,
						'red',
						intl.formatMessage({ id: 'sachtailieu.thongke.stat.theobandoc' }),
						intl.formatMessage({
							id:
								trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
									? 'sachtailieu.thongke.stat.tooltip.theobandoc.muon'
									: 'sachtailieu.thongke.stat.tooltip.theobandoc.tra',
						}),
					)}
				</Col>
				<Col span={24} md={8}>
					{renderCard(
						dataTheMuonAnPham?.theoDauAnPham ?? 0,
						'green',
						intl.formatMessage({ id: 'sachtailieu.thongke.stat.theoanhpham' }),
						intl.formatMessage({
							id:
								trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
									? 'sachtailieu.thongke.stat.tooltip.theoanhpham.muon'
									: 'sachtailieu.thongke.stat.tooltip.theoanhpham.tra',
						}),
					)}
				</Col>
			</Row>
		</Spin>
	);
};

export default StatThongKeMuonTra;
