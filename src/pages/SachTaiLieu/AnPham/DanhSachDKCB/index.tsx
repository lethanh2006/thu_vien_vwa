import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiDangKyCaBiet, nameTrangThaiDangKyCaBiet } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import { DKCBActionAlert, DKCBDeleteSelected, DKCBRowActions } from '../../DangKyCaBiet/components/Actions';
import ManualAddDKCB from '../../DangKyCaBiet/components/ManualAdd';
import StatDanhSachDKCB from '../../DangKyCaBiet/components/Stat';
import useDKCBActions from '../../DangKyCaBiet/components/useDKCBActions';

const DanhSachDKCB = ({ onChanged }: { onChanged?: () => unknown }) => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit } = useModel('sachtailieu.anpham.anphamxepgia');
	const [trangThai, setTrangThai] = useState<string>('ALL');

	const getData = () => {
		if (recAnPham?._id) {
			return getModel(
				{ anPhamId: recAnPham._id, ...(trangThai === 'ALL' ? {} : { trangThai: trangThai as any }) },
				undefined,
				{ soDangKyCaBiet: 1 },
			);
		}
		return undefined;
	};
	const actions = useDKCBActions({ anPhamId: recAnPham?._id, scope: trangThai, getData, onChanged });

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{recAnPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => recAnPham?.tacGia,
		},

		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (_, rec) => (rec.thongTinXepGia?.donGia == null ? null : `${inputFormat(rec.thongTinXepGia.donGia)} VNĐ`),
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_, record) => <DKCBRowActions record={record} {...actions} />,
		},
	];

	return (
		<>
			<StatDanhSachDKCB
				key={recAnPham?._id}
				condition={{
					anPhamId: recAnPham?._id,
				}}
			/>

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab)}>
				<Tabs.TabPane key='ALL' tab='Tất cả' />
				{Object.values(ETrangThaiDangKyCaBiet).map((tab) => (
					<Tabs.TabPane key={tab} tab={nameTrangThaiDangKyCaBiet[tab]} />
				))}
			</Tabs>
			<DKCBActionAlert error={actions.actionError} />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPham?._id, trangThai]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				rowSelection
				deleteMany={false}
				detailRow={{ getCheckboxProps: () => ({ disabled: actions.busy }) }}
				otherButtons={[
					<ManualAddDKCB
						key='create-dkcb'
						anPham={recAnPham}
						disabled={actions.busy || !recAnPham?._id}
						onCreated={actions.refresh}
					/>,
					<DKCBDeleteSelected key='delete-dkcb' {...actions} />,
				]}
				hideCard
			/>
		</>
	);
};

export default DanhSachDKCB;
