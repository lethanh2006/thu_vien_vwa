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
	DeleteOutlined,
	EditOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	StarOutlined,
	StarTwoTone,
} from '@ant-design/icons';
import { Avatar, Button, Card, Popconfirm, Popover, Select, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../../assets/new6.gif';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import ModalBienMucTaiLieu from './components/Modal';
import ModalSachHay from './components/ModalSachHay';
import Z3950Page from './Z3950';

const BienMucSachTaiLieuPage = () => {
	const intl = useIntl();
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const {
		getModel,
		page,
		limit,
		handleEdit,
		handleView,
		setRecord,
		setEdit,
		setIsView,
		setVisibleForm,
		putBienMucSoLuocModel,
		setVisibleTimKiemZ3950,
		deleteModel,
	} = useModel('sachtailieu.anpham.anpham');
	const [visibleSachHay, setVisibleSachHay] = useState<boolean>(false);

	const getData = () => {
		getModel({
			dotNhapSachId: recDot?._id,
			trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC,
		});
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const handleSachHay = (rec: AnPham.IRecord, isSachHay: boolean) => {
		putBienMucSoLuocModel(rec?._id ?? '', { ...rec, isSachHay }, getData);
	};

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Ảnh',
			dataIndex: 'urlScanBia',
			width: 80,
			align: 'center',
			render: (url: string, rec) => (
				<Avatar src={url} alt={rec?.nhanDe} shape='square' style={{ width: 40, height: 40, objectFit: 'cover' }} />
			),
			onCell,
		},
		{
			title: 'Mã tài liệu',
			dataIndex: 'maTaiLieu',
			width: 150,
			render: (val, rec) =>
				val && (
					<>
						{val} {rec?.dotNhapSach?.dotNhapSachMoi && <img style={{ width: 30, height: 20 }} src={news} />}
					</>
				),
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGiaConverse',
			width: 150,
			filterType: 'string',
			render: (val, rec) => val ?? rec?.nhanDe,
			onCell,
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDeConverse',
			width: 150,
			filterType: 'string',
			render: (val, rec) => val ?? rec?.tacGia,
			onCell,
		},
		{
			title: 'Sách hay',
			dataIndex: 'isSachHay',
			align: 'center',
			width: 80,
			render: (val) =>
				val ? (
					<Tooltip title='Sách hay'>
						<StarTwoTone twoToneColor='#fadb14' style={{ fontSize: 20 }} />
					</Tooltip>
				) : (
					<Tooltip title='Không phải sách hay'>
						<StarOutlined style={{ color: '#ccc', fontSize: 20 }} />
					</Tooltip>
				),
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder='Lọc sách hay'
					options={[
						{ label: 'Sách hay', value: true },
						{ label: 'Không', value: false },
					]}
					allowClear
					showArrow
					showSearch
					optionFilterProp='label'
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
			filterCustomSelect: <SelectKieuBanGhi multiple selectMa />,
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
			filterCustomSelect: <SelectCapThuMuc multiple selectMa />,
			onCell,
		},
		{
			title: 'Vật mang tin',
			dataIndex: 'maVatMangTin',
			width: 150,
			render: (val, rec) => rec?.vatMangTin?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectVatMangTin multiple selectMa />,
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
			onCell,
			filterType: 'select',
			filterData: Object.values(ETrangThaiBienMuc),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Biên mục chi tiết'
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popover
						placement='topRight'
						content={
							<>
								{!rec?.isSachHay ? (
									<ButtonExtend
										tooltip='Sách hay'
										type='link'
										className='text-success'
										icon={<StarOutlined />}
										onClick={() => {
											setRecord(rec);
											setVisibleSachHay(true);
										}}
									/>
								) : (
									<Popconfirm
										onConfirm={() => handleSachHay(rec, false)}
										title='Xác nhận đây bỏ sách hay này?'
										placement='topRight'
									>
										<ButtonExtend tooltip='Bỏ sách hay' type='link' danger icon={<StarTwoTone />} />
									</Popconfirm>
								)}

								{/* <ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} /> */}

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
		<Card title={intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}>
			<div style={{ marginBottom: 12 }}>
				<SelectDotNhapSach
					style={{ width: 250 }}
					value={recDot?._id}
					onChange={(val) => setRecDot(danhSachDot?.find((item) => item?._id === val))}
					allowClear
				/>
			</div>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}
				Form={ModalBienMucTaiLieu}
				formProps={{ getData, isBienMuc: true }}
				widthDrawer={1200}
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<ButtonExtend
						key={'1'}
						onClick={() => {
							setRecord({} as AnPham.IRecord);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
						type='primary'
						notHideText
						tooltip='Biên mục sơ lược'
					>
						Biên mục sơ lược
					</ButtonExtend>,

					<ButtonExtend key='3' tooltip='Biên mục qua Z39.50' onClick={() => setVisibleTimKiemZ3950(true)}>
						Biên mục qua Z39.50
					</ButtonExtend>,
				]}
			/>

			<ModalSachHay visible={visibleSachHay} setVisible={setVisibleSachHay} getData={getData} />

			<Z3950Page getData={getData} />
		</Card>
	);
};

export default BienMucSachTaiLieuPage;
