import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiMauDinhDang } from '@/services/DanhMuc/constant';
import type { MauDinhDang } from '@/services/DanhMuc/MauDinhDang/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const MauDinhDangPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('danhmuc.maudinhdang');
	const [tabActive, setTabActive] = useState<ELoaiMauDinhDang>(ELoaiMauDinhDang.MAU_BARCODE);

	const getData = () => {
		getModel({ loai: tabActive });
	};

	const columns: IColumn<MauDinhDang.IRecord>[] = [
		{
			title: 'Mã ',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên mẫu',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDungMau',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa định dạng này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'danhmuc.maudinhdang.title' })}>
			<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab as ELoaiMauDinhDang)}>
				{Object.values(ELoaiMauDinhDang).map((tab) => (
					<Tabs.TabPane key={tab} tab={tab} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, tabActive]}
				modelName='danhmuc.maudinhdang'
				title={intl.formatMessage({ id: 'danhmuc.maudinhdang.title' })}
				Form={Form}
				formProps={{ getData, tabActive }}
				hideCard
				widthDrawer={700}
			/>
		</Card>
	);
};

export default MauDinhDangPage;
