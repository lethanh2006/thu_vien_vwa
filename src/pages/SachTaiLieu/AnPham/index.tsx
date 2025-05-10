import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	DollarOutlined,
	EditOutlined,
	ExportOutlined,
	EyeOutlined,
	MenuOutlined,
} from '@ant-design/icons';
import { Button, Card, Checkbox, Popconfirm, Popover, Segmented, Select, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalBienMucTaiLieu from '../BienMuc/components/Modal';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';
import { thongKeMauSoDKCB } from '@/services/SachTaiLieu/AnPham';
import fileDownload from 'js-file-download';

const CardAnPham = () => {
	const intl = useIntl();
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { getModel, page, limit, handleView, setRecord, deleteModel, isView, handleEdit, putModel } =
		useModel('sachtailieu.anpham.anpham');
	const { setVisibleForm } = useModel('sachtailieu.anpham.xepgia');
	const [tabActive, setTabActive] = useState<string>('1');
	const [loading, setLoading] = useState<boolean>(false);

	const getData = () => {
		getModel({
			dotNhapSachId: recDot?._id,
			trangThai: ETrangThaiBienMuc.DA_BIEN_MUC,
			online: tabActive === '1' ? false : true,
		});
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const handleSachHay = (rec: AnPham.IRecord, isSachHay: boolean) => {
		putModel(rec?._id ?? '', { ...rec, isSachHay }, getData);
	};

	const handleExport = () => {
		setLoading(true);
		if (recDot?._id)
			thongKeMauSoDKCB(recDot?._id)
				.then((res) => {
					fileDownload(res.data, 'Mẫu số đăng ký cá biệt.xlsx');
				})
				.catch((error) => console.error('Export failed:', error))
				.finally(() => {
					setLoading(false);
				});
	};

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã tài liệu',
			dataIndex: 'maTaiLieu',
			width: 120,
			filterType: 'string',
			onCell,
		},

		{
			title: 'Nhan đề',
			dataIndex: 'nhanDeConverse',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGiaConverse',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Sách hay',
			dataIndex: 'isSachHay',
			align: 'center',
			width: 90,
			render: (val, rec) => <Checkbox checked={!!val} />,
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder='Sách hay'
					options={[
						{ label: 'Có', value: true },
						{ label: 'Không', value: false },
					]}
					allowClear
				/>
			),
			onCell,
		},
		{
			title: 'Kiểu bản ghi',
			dataIndex: 'maKieuBanGhi',
			width: 150,
			render: (val, rec) => rec?.kieuBanGhi?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuBanGhi multiple />,
			onCell,
		},
		{
			title: 'Dạng tài liệu',
			dataIndex: 'maDangTaiLieu',
			width: 150,
			render: (val, rec) => rec?.dangTaiLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectDangTaiLieu multiple selectMa />,
			onCell,
		},
		{
			title: 'Cấp thư mục',
			dataIndex: 'maCapThuMuc',
			width: 150,
			render: (val, rec) => rec?.capThuMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectCapThuMuc multiple />,
			onCell,
		},
		{
			title: 'Vật mang tin',
			dataIndex: 'maVatMangTin',
			width: 150,
			render: (val, rec) => rec?.vatMangTin?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectVatMangTin multiple />,
			onCell,
		},
		{
			title: 'Mẫu biên mục',
			dataIndex: 'mauBienMucId',
			width: 150,
			render: (val, rec) => rec?.mauBienMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectMauBienMuc multiple />,
			onCell,
		},
		{
			title: 'Độ mật',
			align: 'center',
			dataIndex: 'doMat',
			width: 90,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag
					style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
					color={colorTrangThaiBienMuc[val as ETrangThaiBienMuc]}
				>
					{val}
				</Tag>
			),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					{!rec?.isSachHay ? (
						<Popconfirm
							onConfirm={() => handleSachHay(rec, true)}
							title='Xác nhận đây là sách hay này?'
							placement='topRight'
						>
							<ButtonExtend tooltip='Sách hay' type='link' className='text-success' icon={<CheckOutlined />} />
						</Popconfirm>
					) : (
						<Popconfirm
							onConfirm={() => handleSachHay(rec, false)}
							title='Xác nhận đây bỏ sách hay này?'
							placement='topRight'
						>
							<ButtonExtend tooltip='Bỏ sách hay' type='link' danger icon={<CloseOutlined />} />
						</Popconfirm>
					)}
					<Popover
						placement='topRight'
						content={
							<>
								<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
								<ButtonExtend
									tooltip='Xếp giá'
									onClick={() => {
										setRecord(rec);
										setVisibleForm(true);
									}}
									type='link'
									icon={<DollarOutlined />}
								/>
								<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
								<Popconfirm
									onConfirm={() => deleteModel(rec._id, getData)}
									title='Bạn có chắc chắn muốn xóa thông tin này?'
									placement='topRight'
								>
									<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
								</Popconfirm>
							</>
						}
					>
						<Button type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, tabActive, recDot?._id]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={isView ? ModalAnPham : ModalBienMucTaiLieu}
				widthDrawer={1100}
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<SelectDotNhapSach
						key={'1'}
						isSetRecord
						style={{ width: 250 }}
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot?.find((item) => item?._id === val))}
						allowClear
					/>,
					<Segmented
						key={'2'}
						value={tabActive}
						onChange={(value) => setTabActive(value.toString())}
						options={[
							{ value: '1', label: 'Ấn phẩm vật lý' },
							{ value: '2', label: 'Ấn phẩm số' },
						]}
					/>,

					<ButtonExtend
						disabled={!recDot?._id}
						loading={loading}
						key='3'
						icon={<ExportOutlined />}
						onClick={() => handleExport()}
					>
						Thống kê số ĐKCB
					</ButtonExtend>,
				]}
			/>

			<ModalXepGia />
		</Card>
	);
};

export default CardAnPham;
