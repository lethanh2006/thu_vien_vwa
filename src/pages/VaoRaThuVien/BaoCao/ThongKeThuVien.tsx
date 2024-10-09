import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { EOperatorType } from '@/components/Table/constant';
import { Card, Col, DatePicker, Row, Segmented, Select, Space } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import SoLuongVaoRaThuVienTheoKhoa from './SoLuongTheoKhoa';
import SoLuongVaoRaThuVienTheoNganh from './SoLuongTheoNganh';
import SoLuongTopVaoRaThuVien from './SoLuongTopThuVien';

const ThongKeThuVien = () => {
	const [filters, setFilters] = useState<any[]>([]);
	const [typeSoft, setTypeSoft] = useState<string>();
	const [activeKey, setActiveKey] = useState<string>('nganh');

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

			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<Card title='Số lượng vào ra thư viện' bordered={false} bodyStyle={{ padding: 0 }}>
						<div style={{ marginTop: 12, marginBottom: 12 }}>
							<Segmented
								value={activeKey}
								onChange={(value) => setActiveKey(value.toString())}
								options={[
									{ value: 'nganh', label: 'Theo ngành' },
									{ value: 'khoa', label: 'Theo hóa' },
								]}
							/>
						</div>

						{activeKey === 'nganh' ? (
							<SoLuongVaoRaThuVienTheoNganh filters={filters} />
						) : (
							<SoLuongVaoRaThuVienTheoKhoa filters={filters} />
						)}
					</Card>
				</Col>
				<Col xs={24} lg={10}>
					<SoLuongTopVaoRaThuVien filters={filters} />
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeThuVien;
