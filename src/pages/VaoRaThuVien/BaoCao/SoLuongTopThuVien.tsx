import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportThongKe } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { getFilenameHeader } from '@/utils/utils';
import { ArrowRightOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Progress } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { Link, useIntl, useModel } from 'umi';
import VaoRaThuVienPage from '../DanhSachSinhVien';

const SoLuongTopVaoRaThuVien = (props: { dateRange?: any; isDashBoard?: boolean }) => {
	const intl = useIntl();
	const { dateRange, isDashBoard } = props;
	const { loadingTop, dataThongKeCheckInTop, getSoLuotCheckInTopModel } = useModel('quanlythuvien.vaorathuvien');
	const [record, setRecord] = useState<QuanLyThuVien.IThongKeCheckInTop>();
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);

	useEffect(() => {
		getSoLuotCheckInTopModel(dateRange?.[0], dateRange?.[1]);
	}, [dateRange]);

	const handleExport = async () => {
		await exportThongKe('top', {
			thoiGianBatDau: dateRange?.[0],
			thoiGianKetThuc: dateRange?.[1],
		}).then((response) => {
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
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.maSinhVien' }),
			dataIndex: 'maSv',
			width: 120,
			// filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.hoTen' }),
			dataIndex: 'hoTen',
			width: 160,
			// filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.tongLuot' }),
			dataIndex: 'total',
			width: 140,
			render: (val, rec, index) => {
				const firstTotal = dataThongKeCheckInTop[0]?.total || 1;
				const percent = index === 0 ? 100 : ((val / firstTotal) * 100).toFixed(2);
				return <Progress percent={Number(percent)} format={() => `${val}`} style={{ width: '100%' }} />;
			},
			// filterType: 'number',
			// sortable: true,
			onCell,
		},
	];

	return (
		<Card
			title={intl.formatMessage({ id: 'vaorathuvien.card.title.banDocCoSoLuotVaoThuVienNhieuNhat' })}
			extra={
				isDashBoard ? (
					<Link to='/vao-ra-thu-vien/tong-hop'>
						{intl.formatMessage({ id: 'vaorathuvien.label.xemThem' })} <ArrowRightOutlined />
					</Link>
				) : null
			}
			variant='borderless'
			styles={{ body: { padding: 8 } }}
			size='small'
		>
			<TableStaticData
				loading={loadingTop}
				columns={columns}
				data={dataThongKeCheckInTop ?? []}
				otherProps={{ pagination: false }}
				hasTotal
				addStt
			>
				<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport()}>
					{intl.formatMessage({ id: 'vaorathuvien.button.xuatDuLieu' })}
				</ButtonExtend>
			</TableStaticData>

			<Modal
				title={`${intl.formatMessage({
					id: 'vaorathuvien.card.title.danhSachVaoRaThuVien',
				})} ${record?.maSv ?? ''} - ${record?.hoTen ?? ''}`}
				open={visibleChiTiet}
				onCancel={() => setVisibleChiTiet(false)}
				footer={null}
				width={800}
			>
				<VaoRaThuVienPage maSinhVien={record?.maSv} dateRange={dateRange} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleChiTiet(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Modal>
		</Card>
	);
};

export default SoLuongTopVaoRaThuVien;
