import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { Card, Col, Row, Segmented } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import SoLuongVaoRaThuVienTheoKhoa from './SoLuongTheoKhoa';
import SoLuongVaoRaThuVienTheoNganh from './SoLuongTheoNganh';
import SoLuongVaoRaThuVienTheoThang from './SoLuongTheoThang';
import SoLuongTopVaoRaThuVien from './SoLuongTopThuVien';

const ThongKeThuVien = () => {
	const [activeKey, setActiveKey] = useState<string>('nganh');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('65%');
	const [dateRange, setDateRange] = useState<any>([
		moment().startOf('M').toISOString(),
		moment().endOf('M').toISOString(),
	]);

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Card title='Tổng hợp vào ra thư viện'>
					<MyDateRangePicker
						style={{ width: 300 }}
						value={dateRange}
						onChange={(val: any) => setDateRange(val)}
						ranges={{
							'Hôm nay': [moment(), moment()],
							'Tuần này': [moment().startOf('week'), moment().endOf('week')],
							'Tháng này': [moment().startOf('M'), moment().endOf('M')],
						}}
						allowClear
					/>

					<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
						<Pane initialSize={paneSize} minSize='40%'>
							<Card title='Số lượng vào ra thư viện' bordered={false} style={{ marginLeft: -18 }}>
								<div style={{ marginBottom: 12 }}>
									<Segmented
										value={activeKey}
										onChange={(value) => setActiveKey(value.toString())}
										options={[
											{ value: 'nganh', label: 'Theo ngành' },
											{ value: 'khoa', label: 'Theo khóa' },
										]}
									/>
								</div>

								{activeKey === 'nganh' ? (
									<SoLuongVaoRaThuVienTheoNganh dateRange={dateRange} />
								) : (
									<SoLuongVaoRaThuVienTheoKhoa dateRange={dateRange} />
								)}
							</Card>
						</Pane>
						<Pane minSize='20%'>
							<SoLuongTopVaoRaThuVien dateRange={dateRange} />
						</Pane>
					</SplitPane>
				</Card>
			</Col>
			<Col span={24}>
				<SoLuongVaoRaThuVienTheoThang />
			</Col>
		</Row>
	);
};

export default ThongKeThuVien;
