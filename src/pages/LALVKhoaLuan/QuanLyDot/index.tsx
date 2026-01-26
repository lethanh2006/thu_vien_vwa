import ExpandText from '@/components/ExpandText';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiDotQuanLyThuvien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Space } from 'antd';
import { useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import ModalFormQuanLyDot from './components/ModalForm';

const QuanLyDotPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('quanlythuvien.quanlydot');
	const { setLoai } = useModel('quanlythuvien.danhsachdot');
	const [datePicker, setDatePicker] = useState<any>();

	const getData = () => {
		const filter = [
			{
				active: true,
				field: 'thoiGianBatDau',
				values: [dayjs(datePicker?.[0]).startOf('date'), dayjs(datePicker?.[1]).endOf('date')],
				operator: EOperatorType.BETWEEN,
			},
		];

		getModel(undefined, datePicker ? filter : (undefined as any));
	};

	const onCell = (rec: QuanLyThuVien.IQuanLyDot) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuanLyThuVien.IQuanLyDot>[] = [
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDot' }),
			dataIndex: 'tenDot',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.thoiGian' }),
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 200,
			render: (val, rec) =>
				val && (
					<>
						{dayjs(val).format('HH:mm DD/MM/YYYY')} - {dayjs(rec?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
					</>
				),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.loai' }),
			dataIndex: 'loai',
			align: 'center',
			width: 150,
			filterType: 'select',
			filterData: Object.values(ELoaiDotQuanLyThuvien),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.ghiChu' }),
			dataIndex: 'ghiChu',
			width: 150,
			onCell,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'luananluanvankhoaluan.card.title.chiTiet' })}
						onClick={() => {
							setLoai(rec?.loai);
							history.push('/la-lv-kl-sinh-vien/danh-sach-sinh-vien');
						}}
						type='link'
						icon={<EyeOutlined />}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'luananluanvankhoaluan.confirm.banCoChacChanMuonXoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'luananluanvankhoaluan.title.quanLyDotLuanAnLuanVanKhoaLuan' })}>
			<Space style={{ marginBottom: 12 }}>
				<MyDateRangePicker
					value={datePicker}
					onChange={(val) => setDatePicker(val)}
					allowClear
					style={{ width: 300 }}
				/>
			</Space>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, datePicker]}
				modelName='quanlythuvien.quanlydot'
				hideCard
				formProps={{ getData }}
				Form={ModalFormQuanLyDot}
				title={intl.formatMessage({ id: 'luananluanvankhoaluan.title.quanLyDot' })}
				widthDrawer={1000}
			/>
		</Card>
	);
};

export default QuanLyDotPage;
