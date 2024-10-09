import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { EOperatorType } from '@/components/Table/constant';
import { Card, DatePicker, Segmented, Select, Space } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import SoLuongVaoRaThuVienTheoKhoa from './SoLuongTheoKhoa';
import SoLuongVaoRaThuVienTheoNganh from './SoLuongTheoNganh';
import SoLuongTopVaoRaThuVien from './SoLuongTopThuVien';

const ThongKeThuVien = () => {
	const [filters, setFilters] = useState<any[]>([]);
	const [typeSoft, setTypeSoft] = useState<string>();
	const [activeKey, setActiveKey] = useState<string>('nganh');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('65%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const handleChange = (value: string) => {
		setTypeSoft(value);
		if (value) {
			switch (value) {
				case 'week':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [moment().subtract(7, 'days').startOf('day').toISOString(), moment().endOf('day').toISOString()],
							operator: EOperatorType.BETWEEN,
						},
					]);
					break;
				case 'month':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [
								moment()
									.set('month', moment().month() - 1)
									.startOf('month')
									.toISOString(),
								moment().endOf('day').toISOString(),
							],
							operator: EOperatorType.BETWEEN,
						},
					]);
					break;
				case 'precious':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [
								moment()
									.set('month', moment().month() - 6)
									.startOf('month')
									.toISOString(),
								moment().endOf('day').toISOString(),
							],
							operator: EOperatorType.BETWEEN,
						},
					]);
					break;
				case 'year':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [
								moment()
									.set('year', moment().year() - 1)
									.startOf('year')
									.toISOString(),
								moment().endOf('day').toISOString(),
							],
							operator: EOperatorType.BETWEEN,
						},
					]);
					break;
				case 'detail':
					break;
				case 'about':
					break;
			}
		} else {
			setFilters([]);
		}
	};

	const handleChangeTime = (value: any) => {
		if (value) {
			setFilters([
				{
					active: true,
					field: 'thoiGianCheckIn',
					values: [moment(value[0]).startOf('day').toISOString(), moment(value[1]).endOf('day').toISOString()],
					operator: EOperatorType.BETWEEN,
				},
			]);
		} else {
			setFilters([]);
		}
	};

	const handleChangeTimeDate = (value: any) => {
		if (value) {
			setFilters([
				{
					active: true,
					field: 'thoiGianCheckIn',
					values: [moment(value).startOf('day').toISOString(), moment(value).endOf('day').toISOString()],
					operator: EOperatorType.BETWEEN,
				},
				...filters,
			]);
		} else {
			setFilters([]);
		}
	};

	return (
		<Card title='Tổng hợp vào ra thư viện'>
			<Space style={{ marginBottom: 12 }}>
				<Select
					onChange={(val) => handleChange(val)}
					style={{ width: 250 }}
					value={typeSoft}
					placeholder='Chọn khoảng thời gian'
					options={[
						{
							value: 'week',
							label: 'Tuần trước',
						},
						{
							value: 'month',
							label: 'Tháng trước',
						},
						{
							value: 'precious',
							label: '6 tháng trước',
						},
						{
							value: 'year',
							label: '1 Năm trước',
						},
						{
							value: 'detail',
							label: 'Thời gian cụ thể',
						},
						{
							value: 'about',
							label: 'Khoảng thời gian cụ thể',
						},
					]}
					allowClear
				/>
				{typeSoft === 'detail' && (
					<DatePicker
						style={{ marginRight: '16px' }}
						onChange={handleChangeTimeDate}
						disabledDate={(cur) => moment(cur).isAfter(moment())}
					/>
				)}
				{typeSoft === 'about' && (
					<MyDateRangePicker
						style={{ marginRight: '16px' }}
						onChange={handleChangeTime}
						disabledDate={(cur) => moment(cur).isAfter(moment())}
					/>
				)}
			</Space>

			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='40%'>
					<Card title='Số lượng vào ra thư viện' bordered={false} bodyStyle={{ padding: 0 }}>
						<div style={{ marginTop: 12, marginBottom: 12 }}>
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
							<SoLuongVaoRaThuVienTheoNganh filters={filters} />
						) : (
							<SoLuongVaoRaThuVienTheoKhoa filters={filters} />
						)}
					</Card>
				</Pane>
				<Pane minSize='20%'>
					<SoLuongTopVaoRaThuVien filters={filters} />
				</Pane>
			</SplitPane>
		</Card>
	);
};

export default ThongKeThuVien;
