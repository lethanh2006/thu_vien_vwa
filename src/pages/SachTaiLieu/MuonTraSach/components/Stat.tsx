import { EOperatorType } from '@/components/Table/constant';
import type { EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatMuonTraSach = (props: { vaiTro?: EVaiTroMuonTra }) => {
	const { vaiTro } = props;
	const intl = useIntl();
	const { thongKeMuonTraSachModel, dataThongKe, loadingThongKe } = useModel('sachtailieu.muontra.muontra');

	const filter = [
		{
			active: true,
			field: ['phieuMuonTra', 'vaiTro'],
			values: [vaiTro],
			operator: EOperatorType.INCLUDE,
		},
	];

	useEffect(() => {
		thongKeMuonTraSachModel(undefined, filter?.filter(Boolean)?.length ? filter?.filter(Boolean) : undefined);
	}, [vaiTro]);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							{inputFormat(dataThongKe?.choXuLy ?? 0)}
						</span>
						<span>{intl.formatMessage({ id: 'sachtailieu.muontra.stat.choxuly' })}</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'orange' }}>
							{inputFormat(dataThongKe?.dangThueMuon ?? 0)}
						</span>
						<span>{intl.formatMessage({ id: 'sachtailieu.muontra.stat.dangmuon' })}</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'rec' }}>
							{inputFormat(dataThongKe?.quaHan ?? 0)}
						</span>
						<span>{intl.formatMessage({ id: 'sachtailieu.muontra.stat.quahanmuon' })}</span>
					</Card>
				</Col>
				<Col span={24} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'green' }}>
							{inputFormat(dataThongKe?.daTra ?? 0)}
						</span>
						<span>{intl.formatMessage({ id: 'sachtailieu.muontra.stat.datra' })}</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatMuonTraSach;
