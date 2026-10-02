import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { thongKeMauSoDKCB } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { DollarOutlined, ExportOutlined, StarOutlined, StarTwoTone } from '@ant-design/icons';
import { Avatar, Card, Select, Tag, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import news from '../../../assets/new6.gif';
import SelectDotNhapSach from '../DotNhapSach/components/Select';
import { DkcbDetailsModal, DkcbSummary } from './components/DkcbSummary';
import ModalAnPham from './components/Modal';
import { publicationMetadataColumns } from './components/PublicationColumns';
import PublicationTitle from './components/PublicationTitle';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';
import { PUBLICATION_POPULATION } from './utils/bibliography';

const CardAnPham = () => {
	const intl = useIntl();
	const { record: recDot, danhSach: danhSachDot, setRecord: setRecDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { getModel, page, limit, handleView, setRecord } = useModel('sachtailieu.anpham.anpham');
	const { setVisibleForm } = useModel('sachtailieu.anpham.xepgia');
	const [loading, setLoading] = useState<boolean>(false);
	const [inventoryRevision, setInventoryRevision] = useState(0);

	const [dkcbRecord, setDkcbRecord] = useState<AnPham.IRecord>();

	const getData = () => {
		return getModel(
			{
				dotNhapSachId: recDot?._id,
				trangThai: ETrangThaiBienMuc.DA_BIEN_MUC,
				online: false,
			},
			undefined,
			{
				updatedAt: -1,
			},
			undefined,
			undefined,
			undefined,
			{ population: PUBLICATION_POPULATION },
		);
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const handleInventoryChanged = () => {
		setInventoryRevision((value) => value + 1);
		return getData();
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
			title: 'Ảnh',
			dataIndex: 'urlScanBia',
			width: 80,
			align: 'center',
			render: (url: string, rec) => (
				<Avatar
					src={url || '/logo.png'}
					alt={rec?.nhanDe}
					shape='square'
					style={{ width: 40, height: 40, objectFit: 'cover' }}
				/>
			),
			onCell,
		},
		{
			title: 'Loại ấn phẩm',
			dataIndex: 'online',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? 'green' : 'blue'}>{val ? 'Ấn phẩm số' : 'Ấn phẩm vật lý'}</Tag>,
			filterType: 'customselect',
			filterCustomSelect: (
				<Select
					mode='multiple'
					placeholder='Chọn loại ấn phẩm'
					options={[
						{ label: 'Ấn phẩm số', value: true },
						{ label: 'Ấn phẩm vật lý', value: false },
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
			title: 'Nhan đề',
			dataIndex: 'nhanDeConverse',
			width: 260,
			render: (_, rec) => <PublicationTitle record={rec} />,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGiaConverse',
			width: 150,
			render: (val, rec) => val ?? rec?.tacGia,
			filterType: 'string',
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
			filterType: 'select',
			filterData: Object.values(ETrangThaiBienMuc),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, rec) => (
				<ButtonExtend
					tooltip='Xếp giá'
					onClick={() => {
						setRecord(rec);
						setVisibleForm(true);
					}}
					type='link'
					icon={<DollarOutlined />}
				/>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham refreshKey={inventoryRevision} />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDot?._id]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={ModalAnPham}
				formProps={{ getData: handleInventoryChanged, isBienMuc: false }}
				widthDrawer={1200}
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<SelectDotNhapSach
						key={'1'}
						style={{ width: 250 }}
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot?.find((item) => item?._id === val))}
						allowClear
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

			<ModalXepGia onChanged={handleInventoryChanged} />
			<DkcbDetailsModal
				record={dkcbRecord}
				onClose={() => setDkcbRecord(undefined)}
				onChanged={handleInventoryChanged}
			/>
		</Card>
	);
};

export default CardAnPham;
