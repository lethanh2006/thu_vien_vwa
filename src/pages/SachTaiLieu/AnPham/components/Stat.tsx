import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const StatAnPham = ({ refreshKey = 0 }: { refreshKey?: number }) => {
	const { getThongKeAnPhamModel, loadingThongKe } = useModel('sachtailieu.anpham.anpham');
	const [recThongKe, setRecThongKe] = useState<AnPham.IThongKeAnPham>();

	useEffect(() => {
		let cancelled = false;
		getThongKeAnPhamModel()
			.then((res) => {
				if (!cancelled) setRecThongKe(res);
			})
			.catch(() => undefined);
		return () => {
			cancelled = true;
		};
	}, [refreshKey]);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							{inputFormat(recThongKe?.tongSoAnPham ?? 0)}
						</span>
						<span>Số ấn phẩm đã biên mục chi tiết</span>
					</Card>
				</Col>
				<Col span={24} md={12}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'red' }}>
							{inputFormat(recThongKe?.tongAnPhamDangThueMuon ?? 0)}
						</span>
						<span>Số bản đang mượn (của các ấn phẩm đã biên mục chi tiết)</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatAnPham;
