import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { EOperatorType } from '@/components/Table/constant';
import { Card, Segmented } from 'antd';
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
	const [filters, setFilters] = useState<any[]>([]);
	const [activeKey, setActiveKey] = useState<string>('nganh');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('65%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const handleChangeTime = (value: any) => {
		if (value) {
			setFilters([
				{
					active: true,
					field: 'thoiGianCheckIn',
					values: [value[0], value[1]],
					operator: EOperatorType.BETWEEN,
				},
			]);
		} else {
			setFilters([]);
		}
	};

	return (
		<Card title='Tổng hợp vào ra thư viện'>
			<MyDateRangePicker
				style={{ width: 300 }}
				onChange={handleChangeTime}
				ranges={{
					'Hôm nay': [moment(), moment()],
					'Tuần này': [moment().startOf('week'), moment().endOf('week')],
					'Tháng này': [moment().startOf('M'), moment().endOf('M')],
				}}
				allowClear
			/>

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

			<SoLuongVaoRaThuVienTheoThang />
		</Card>
	);
};

export default ThongKeThuVien;
