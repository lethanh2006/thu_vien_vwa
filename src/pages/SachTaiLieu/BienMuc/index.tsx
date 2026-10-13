import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import {
	colorTrangThaiBienMuc,
	ETrangThaiBienMuc,
	TRUONG_BAT_BUOC_BIEN_MUC_SO_LUOC,
} from '@/services/SachTaiLieu/constant';
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
import { Avatar, Button, Card, Modal, Popconfirm, Popover, Select, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../../assets/new6.gif';
import useColumnsThongTinAnPham, { NhanDeAnPham, populationAnPham } from '../AnPham/components/ColumnsThongTinAnPham';
import DanhSachDKCB from '../AnPham/DanhSachDKCB';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import ModalAnPhamSo from './components/AnPhamSo';
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
		record,
		setRecord,
		setEdit,
		setIsView,
		setVisibleForm,
		putBienMucSoLuocModel,
		setVisibleTimKiemZ3950,
		deleteModel,
		deleteAnPhamSoModel,
	} = useModel('sachtailieu.anpham.anpham');
	const [visibleSachHay, setVisibleSachHay] = useState<boolean>(false);
	const [visibleAnPhamSo, setVisibleAnPhamSo] = useState<boolean>(false);
	const [visibleDKCB, setVisibleDKCB] = useState<boolean>(false);

	// Biên mục quản lý toàn bộ ấn phẩm (chờ và đã biên mục), Xếp giá chỉ làm việc xếp giá
	const getData = () => {
		getModel({ dotNhapSachId: recDot?._id }, undefined, undefined, undefined, undefined, undefined, {
			population: populationAnPham,
		});
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	// Chỉ gửi các trường BE bắt buộc và ô cần đổi: gửi cả record thì ô rỗng bị BE coi là xóa trường MARC tương ứng
	const handleSachHay = (rec: AnPham.IRecord, isSachHay: boolean) => {
		putBienMucSoLuocModel(rec?._id ?? '', { ..._.pick(rec, TRUONG_BAT_BUOC_BIEN_MUC_SO_LUOC), isSachHay }, getData);
	};

	const columnsThongTinAnPham = useColumnsThongTinAnPham((rec) => {
		setRecord(rec);
		setVisibleDKCB(true);
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.anh' }),
			dataIndex: 'urlScanBia',
			width: 80,
			align: 'center',
			render: (url: string, rec) => (
				<Avatar src={url} alt={rec?.nhanDe} shape='square' style={{ width: 40, height: 40, objectFit: 'cover' }} />
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.maTaiLieu' }),
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
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			dataIndex: 'nhanDe',
			width: 260,
			render: (val, rec) => <NhanDeAnPham record={rec} />,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' }),
			dataIndex: 'isSachHay',
			align: 'center',
			width: 80,
			render: (val) =>
				val ? (
					<Tooltip title={intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' })}>
						<StarTwoTone twoToneColor='#fadb14' style={{ fontSize: 20 }} />
					</Tooltip>
				) : (
					<Tooltip title={intl.formatMessage({ id: 'sachtailieu.anpham.khongPhaiSachHay' })}>
						<StarOutlined style={{ color: '#ccc', fontSize: 20 }} />
					</Tooltip>
				),
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.locSachHay' })}
					options={[
						{ label: intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' }), value: true },
						{ label: intl.formatMessage({ id: 'sachtailieu.anpham.khongPhaiSachHay' }), value: false },
					]}
					allowClear
					showArrow
					showSearch
					optionFilterProp='label'
				/>
			),
			onCell,
		},
		...columnsThongTinAnPham,
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.doMat' }),
			align: 'center',
			dataIndex: 'doMat',
			width: 90,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.trangThai' }),
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
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'sachtailieu.anpham.bienMucChiTiet' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popover
						placement='topRight'
						content={
							<>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'sachtailieu.anpham.anPhamSo' })}
									type='link'
									icon={<FilePdfOutlined />}
									onClick={() => {
										setRecord(rec);
										setVisibleAnPhamSo(true);
									}}
								/>
								{rec?.online ? (
									<Popconfirm
										onConfirm={() => deleteAnPhamSoModel(rec?._id, getData)}
										title={intl.formatMessage({ id: 'sachtailieu.confirm.xoaAnPhamSo' })}
										placement='topRight'
									>
										<ButtonExtend
											tooltip={intl.formatMessage({ id: 'sachtailieu.button.xoaAnPhamSo' })}
											type='link'
											icon={<StopOutlined />}
										/>
									</Popconfirm>
								) : null}
								{!rec?.isSachHay ? (
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'sachtailieu.anpham.sachHay' })}
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
										title={intl.formatMessage({ id: 'sachtailieu.confirm.boSachHay' })}
										placement='topRight'
									>
										<ButtonExtend
											tooltip={intl.formatMessage({ id: 'sachtailieu.button.boSachHay' })}
											type='link'
											danger
											icon={<StarTwoTone />}
										/>
									</Popconfirm>
								)}

								{/* <ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} /> */}

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
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}>
			<div style={{ marginBottom: 12 }}>
				<SelectDotNhapSach
					isSetRecord
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
						tooltip={intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}
					>
						{intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}
					</ButtonExtend>,

					<ButtonExtend
						key='3'
						tooltip={intl.formatMessage({ id: 'sachtailieu.bienmuc.z3950' })}
						onClick={() => setVisibleTimKiemZ3950(true)}
					>
						{intl.formatMessage({ id: 'sachtailieu.bienmuc.z3950' })}
					</ButtonExtend>,
				]}
			/>

			<ModalSachHay visible={visibleSachHay} setVisible={setVisibleSachHay} getData={getData} />

			<ModalAnPhamSo visible={visibleAnPhamSo} setVisible={setVisibleAnPhamSo} getData={getData} />

			<Z3950Page getData={getData} />

			<Modal
				title={`${intl.formatMessage({ id: 'sachtailieu.anpham.danhSachDangKyCaBiet' })} - ${record?.nhanDe ?? ''}`}
				open={visibleDKCB}
				onCancel={() => setVisibleDKCB(false)}
				footer={null}
				width={1100}
				destroyOnClose
			>
				<DanhSachDKCB getDataAnPham={getData} />
			</Modal>
		</Card>
	);
};

export default BienMucSachTaiLieuPage;
