import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import dayjs from '@/utils/dayjs';
import { Card, Col, Row, Segmented } from 'antd';
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
		dayjs().startOf('M').toISOString(),
		dayjs().endOf('M').toISOString(),
	]);

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Card title='Tổng hợp vào ra thư viện'>
					<MyDateRangePicker
						style={{ width: 300, marginBottom: 12 }}
						value={dateRange}
						onChange={(val: any) => setDateRange(val)}
						ranges={{
							'Hôm nay': [dayjs().startOf('date'), dayjs().endOf('date')],
							'Tuần này': [dayjs().startOf('week'), dayjs().endOf('week')],
							'Tháng này': [dayjs().startOf('M'), dayjs().endOf('M')],
						}}
						allowClear
					/>

					<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
						<Pane initialSize={paneSize} minSize='40%'>
							<Card title='Số lượng vào ra thư viện' variant='borderless' style={{ padding: '12px 0 0' }}>
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
