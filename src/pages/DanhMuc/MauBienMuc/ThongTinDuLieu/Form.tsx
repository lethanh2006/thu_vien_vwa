import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectTruongBienMuc from '../../TruongBienMuc/components/Select';
import _ from 'lodash';

const FormMauBienMuc = (props: any) => {
	const { getData: getDataExternal, title } = props;
	const { record: recMauBienMuc } = useModel('danhmuc.maubienmuc');
	const { record, setVisibleForm, edit, postModel, formSubmiting, visibleForm, putModel } =
		useModel('danhmuc.thongtindulieu');
	const { danhSach: danhSachTag } = useModel('danhmuc.truongbienmuc');
	const { getAllModel, danhSach, selectedIds, setSelectedIds } = useModel('danhmuc.truongcon');
	const intl = useIntl();
	const [form] = Form.useForm();
	const tag: string = Form.useWatch('tag', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedIds([]);
		} else if (record?._id) {
			form.setFieldsValue(record);
			setSelectedIds(record?.thuocTinhDuLieu?.map((item) => item?.code ?? ''));
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MauBienMuc.IThongTinKhaiBao) => {
		const thongTinTag = danhSachTag.find((item) => item.ma === values.tag);
		values.ten = thongTinTag?.noiDung ?? '';
		values.thuocTinhDuLieu = danhSach
			?.filter((item) => selectedIds?.includes(item.code))
			.map((item) => ({
				code: item.code ?? '',
				ten: item.tieuDe ?? '',
				kieuDuLieu: item?.kieuDuLieu ?? '',
			}));

		if (edit) {
			putModel(record?._id ?? '', values, getDataExternal);
		} else {
			postModel({ ...values, mauBienMucId: recMauBienMuc?._id }, getDataExternal)
				.then()
				.catch((er) => console.log(er));
		}
	};

	const getData = () => {
		getAllModel(undefined, undefined, { tag: tag });
	};

	useEffect(() => {
		if (tag) getData();
	}, [tag]);

	const columns: IColumn<TruongCon.IRecord>[] = [
		{
			title: 'Code',
			dataIndex: 'code',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 220,
			filterType: 'string',
		},
	];

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Trường biên mục' name='tag' rules={[...rules.required]}>
							<SelectTruongBienMuc selectMa />
						</Form.Item>
					</Col>
					{tag ? (
						<Col span={24}>
							<div className='fw500' style={{ marginBottom: 8 }}>
								Danh sách trường con
							</div>
							<TableStaticData
								columns={columns}
								data={_.orderBy(danhSach, ['code'], ['asc'])}
								size='small'
								addStt
								hasTotal
								otherProps={{
									rowKey: (rec: TruongCon.IRecord) => rec.code,
									rowSelection: {
										type: 'checkbox',
										selectedRowKeys: selectedIds ?? [],
										onChange: (selectedRowKeys: any[]) => setSelectedIds(selectedRowKeys),
										columnWidth: 40,
									},
								}}
							/>
						</Col>
					) : null}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormMauBienMuc;
