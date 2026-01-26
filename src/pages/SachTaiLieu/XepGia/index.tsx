import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormLichSuXepGia from '../AnPham/LichSuXepGia/components/Form';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import ChiTietXepGia from './components/ChiTiet';

const XepGiaPage = () => {
	const intl = useIntl();
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { getModel, page, limit, handleEdit, setRecord, visibleForm, setVisibleForm, deleteModel } =
		useModel('sachtailieu.anpham.xepgia');
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);

	const getData = () => {
		getModel({ dotNhapSachId: recDot?._id });
	};

	const onCell = (rec: AnPham.IXepGia) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleChiTiet(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<AnPham.IXepGia>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			width: 120,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nguonBoSung' }),
			dataIndex: 'maNguonBoSung',
			width: 130,
			render: (val, rec) => rec?.nguonBoSung?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNguonBoSung multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.kieuTuLieu' }),
			dataIndex: 'maKieuTuLieu',
			width: 130,
			render: (val, rec) => rec?.kieuTuLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuTuLieu multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.thuVien' }),
			dataIndex: 'thuVienId',
			width: 130,
			render: (val, rec) => rec?.thuVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectThuVien multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.kho' }),
			dataIndex: 'maKhoSach',
			width: 130,
			render: (val, rec) => rec?.khoSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple selectMa />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.giaSach' }),
			dataIndex: 'giaSachId',
			width: 130,
			render: (val, rec) => rec?.giaSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectGiaSach multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.ngayBoSung' }),
			dataIndex: 'ngayBoSung',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.soLuong' }),
			dataIndex: 'soLuong',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.donGia' }),
			dataIndex: 'donGia',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(val ?? 0)} VNĐ`,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.trangThai' }),
			dataIndex: 'daXepGia',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val ? (
					<Tag color='green'>{intl.formatMessage({ id: 'sachtailieu.anpham.daXepGia' })}</Tag>
				) : (
					<Tag color='blue'>{intl.formatMessage({ id: 'sachtailieu.anpham.dangXepGia' })}</Tag>
				),
			filterType: 'select',
			filterData: [
				{
					value: true as any,
					label: intl.formatMessage({ id: 'sachtailieu.anpham.daXepGia' }),
				},
				{
					value: false as any,
					label: intl.formatMessage({ id: 'sachtailieu.anpham.dangXepGia' }),
				},
			],
			fixed: 'right',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topRight'
					content={
						<>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'global.button.chitiet' })}
								onClick={() => {
									setRecord(rec);
									setVisibleChiTiet(true);
								}}
								type='link'
								icon={<EyeOutlined />}
							/>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'sachtailieu.button.xepGia' })}
								onClick={() => handleEdit(rec)}
								type='link'
								icon={<EditOutlined />}
							/>
							<Popconfirm
								onConfirm={() => deleteModel(rec._id, getData)}
								title={intl.formatMessage({ id: 'sachtailieu.confirm.xoa' })}
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
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id]}
				modelName='sachtailieu.anpham.xepgia'
				title={intl.formatMessage({ id: 'sachtailieu.thongTinXepGia' })}
				buttons={{ create: false }}
				otherButtons={[
					<SelectDotNhapSach
						key={'1'}
						isSetRecord
						style={{ width: 250 }}
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot?.find((item) => item?._id === val))}
						allowClear
					/>,
				]}
			/>

			<ChiTietXepGia visible={visibleChiTiet} setVisible={setVisibleChiTiet} />

			<Modal
				title={intl.formatMessage({ id: 'sachtailieu.chinhSuaXepGia' })}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				width={800}
				footer={null}
			>
				<FormLichSuXepGia
					onCancel={() => setVisibleForm(false)}
					onOk={() => {
						getData();
						setVisibleForm(false);
					}}
				/>
			</Modal>
		</>
	);
};

export default XepGiaPage;
