import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportThongKe } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { getFilenameHeader } from '@/utils/utils';
import { ArrowRightOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Progress } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import VaoRaThuVienPage from '../DanhSachSinhVien';
import { EOperatorType } from '@/components/Table/constant';

const SoLuongTopVaoRaThuVien = (props: { dateRange?: any; isDashBoard?: boolean }) => {
	const { dateRange, isDashBoard } = props;
	const { loadingTop, dataThongKeCheckInTop, getSoLuotCheckInTopModel } = useModel('quanlythuvien.vaorathuvien');
	const [record, setRecord] = useState<QuanLyThuVien.IThongKeCheckInTop>();
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);

	const filters = [
		{
			active: true,
			field: 'thoiGianCheckIn',
			values: [dateRange?.[0], dateRange?.[1]],
			operator: EOperatorType.BETWEEN,
		},
	];

	useEffect(() => {
		getSoLuotCheckInTopModel(undefined, dateRange ? filters : undefined);
	}, [dateRange]);

	const handleExport = async () => {
		await exportThongKe('top', undefined, filters ? filters : undefined).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	const onCell = (rec: QuanLyThuVien.IThongKeCheckInTop) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleChiTiet(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuanLyThuVien.IThongKeCheckInTop>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSv',
			width: 90,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tổng lượt',
			dataIndex: 'total',
			width: 150,
			render: (val, rec, index) => {
				const firstTotal = dataThongKeCheckInTop[0]?.total || 1;
				const percent = index === 0 ? 100 : ((val / firstTotal) * 100).toFixed(2);
				return <Progress percent={Number(percent)} format={() => `${val}`} style={{ width: '100%' }} />;
			},
			filterType: 'number',
			sortable: true,
			onCell,
		},
	];

	return (
		<Card
			title='Bạn đọc có số lượt vào thư viện nhiều nhất'
			bordered={isDashBoard ? true : false}
			style={isDashBoard ? undefined : { marginLeft: -18 }}
			extra={
				isDashBoard ? (
					<Link to='/vao-ra-thu-vien/tong-hop'>
						Xem thêm <ArrowRightOutlined />
					</Link>
				) : null
			}
		>
			<div style={isDashBoard ? undefined : { marginTop: 12 }}>
				<TableStaticData
					loading={loadingTop}
					columns={columns}
					data={dataThongKeCheckInTop ?? []}
					otherProps={{ pagination: false }}
					hasTotal
					addStt
				>
					<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport()}>
						Xuất dữ liệu
					</ButtonExtend>
				</TableStaticData>
			</div>

			<Modal
				title='Danh sách vào ra thư viện'
				visible={visibleChiTiet}
				onCancel={() => setVisibleChiTiet(false)}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleChiTiet(false)}>Hủy</Button>
					</div>
				}
				width={800}
			>
				<VaoRaThuVienPage maSinhVien={record?.maSv} />
			</Modal>
		</Card>
	);
};

export default SoLuongTopVaoRaThuVien;
