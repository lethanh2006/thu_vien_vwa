import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportThongKe } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { getFilenameHeader } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Card, Modal } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import VaoRaThuVienPage from '../DanhSachSinhVien';

const SoLuongTopVaoRaThuVien = (props: { filters?: any }) => {
	const { filters } = props;
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
			title: 'Mã sinh viên',
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
			align: 'center',
			width: 80,
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
			bordered={false}
			bodyStyle={{ padding: 0 }}
		>
			<div style={{ marginTop: 12 }}>
				<TableStaticData
					columns={columns}
					data={dataThongKeCheckInTop ?? []}
					size='small'
					otherProps={{ pagination: false }}
					hasTotal
					addStt
				>
					<ButtonExtend size='small' icon={<ExportOutlined />} onClick={() => handleExport()}>
						Xuất dữ liệu
					</ButtonExtend>
				</TableStaticData>
			</div>

			<Modal
				title='Danh sách vào ra thu viện'
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
