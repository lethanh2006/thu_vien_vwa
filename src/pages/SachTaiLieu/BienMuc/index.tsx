import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import {
	DeleteOutlined,
	EditOutlined,
	FilePdfOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	StarOutlined,
	StarTwoTone,
	StopOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Popconfirm, Popover, Select, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../../assets/new6.gif';
import { DkcbDetailsModal, DkcbSummary } from '../AnPham/components/DkcbSummary';
import { publicationMetadataColumns } from '../AnPham/components/PublicationColumns';
import PublicationTitle from '../AnPham/components/PublicationTitle';
import { PUBLICATION_POPULATION } from '../AnPham/utils/bibliography';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import ModalAnPhamSo from './components/AnPhamSo';
import ConfirmXoaAnPham from './components/ConfirmXoa';
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
		deleteAnPhamSoModel,
	} = useModel('sachtailieu.anpham.anpham');
	const [visibleSachHay, setVisibleSachHay] = useState<boolean>(false);
	const [visibleAnPhamSo, setVisibleAnPhamSo] = useState(false);
	const [visibleXoa, setVisibleXoa] = useState(false);

	const [dkcbRecord, setDkcbRecord] = useState<AnPham.IRecord>();

	const getData = () => {
		return getModel({ dotNhapSachId: recDot?._id }, undefined, undefined, undefined, undefined, undefined, {
			population: PUBLICATION_POPULATION,
		});
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const handleSachHay = (rec: AnPham.IRecord, isSachHay: boolean) => {
		putBienMucSoLuocModel(rec?._id ?? '', { isSachHay }, getData).catch(() => undefined);
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
			render: (val, rec) => val ?? rec?.tacGia,
			onCell,
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDeConverse',
			width: 260,
			filterType: 'string',
			render: (_, rec) => <PublicationTitle record={rec} />,
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
			title: 'Đăng ký cá biệt',
			key: 'dkcb',
			width: 220,
			enableGlobalSearch: false,
			render: (_, rec) => (
				<DkcbSummary
					record={rec}
					onClick={() => {
						setRecord(rec);
						setDkcbRecord(rec);
					}}
				/>
			),
		},
		...publicationMetadataColumns(),
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
								<ButtonExtend
									tooltip='Ấn phẩm số'
									type='link'
									icon={<FilePdfOutlined />}
									onClick={() => {
										setRecord(rec);
										setVisibleAnPhamSo(true);
									}}
								/>
								{rec.online && (
									<Popconfirm
										onConfirm={() => deleteAnPhamSoModel(rec._id, getData)}
										title='Xác nhận xóa tài liệu số trên DSpace?'
										placement='topRight'
									>
										<ButtonExtend tooltip='Xóa tài liệu DSpace' type='link' danger icon={<StopOutlined />} />
									</Popconfirm>
								)}
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

								<ButtonExtend
									tooltip='Xóa ấn phẩm'
									onClick={() => {
										setRecord(rec);
										setVisibleXoa(true);
									}}
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
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

			<ModalAnPhamSo visible={visibleAnPhamSo} setVisible={setVisibleAnPhamSo} getData={getData} />
			<ConfirmXoaAnPham
				visible={visibleXoa}
				setVisible={setVisibleXoa}
				getData={getData}
				onShowCopies={(rec) => {
					setVisibleXoa(false);
					setDkcbRecord(rec);
				}}
			/>
			<Z3950Page getData={getData} />
			<DkcbDetailsModal record={dkcbRecord} onClose={() => setDkcbRecord(undefined)} onChanged={getData} />
		</Card>
	);
};

export default BienMucSachTaiLieuPage;
