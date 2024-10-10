import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportThongKe } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { getFilenameHeader } from '@/utils/utils';
import { ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Progress } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import VaoRaThuVienPage from '../DanhSachSinhVien';

const SoLuongTopVaoRaThuVien = (props: { filters?: any; isDashBoard?: boolean }) => {
	const { filters, isDashBoard } = props;
	const { loadingTop, dataThongKeCheckInTop, getSoLuotCheckInTopModel } = useModel('quanlythuvien.vaorathuvien');
	const [record, setRecord] = useState<QuanLyThuVien.IThongKeCheckInTop>();
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);

	useEffect(() => {
		getSoLuotCheckInTopModel(undefined, filters ? filters : undefined);
	}, [filters]);

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
			title: 'Tổng',
			dataIndex: 'total',
			width: 150,
			render: (val, rec) => {
				const total = _.sumBy(dataThongKeCheckInTop, 'total');
				const percent = ((val / total) * 100).toFixed(2);
				return <Progress percent={Number(percent)} style={{ width: '80%' }} />;
			},
			filterType: 'number',
			sortable: true,
			onCell,
		},
	];

	const handleExport = async () => {
		await exportThongKe('top', undefined, filters ? filters : undefined).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	return (
		<Card
			loading={loadingTop}
			title='Bạn đọc có số lượt vào thư viện nhiều nhất'
			bordered={isDashBoard ? true : false}
			bodyStyle={isDashBoard ? undefined : { padding: 0 }}
			extra={
				isDashBoard ? (
					<ButtonExtend
						title='Chi tiết'
						icon={<EyeOutlined />}
						onClick={() => history.push('/vao-ra-thu-vien/tong-hop')}
					/>
				) : null
			}
		>
			<div style={isDashBoard ? undefined : { marginTop: 12 }}>
				<TableStaticData
					columns={columns}
					data={dataThongKeCheckInTop ?? []}
					size='small'
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
