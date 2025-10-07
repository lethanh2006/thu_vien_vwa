import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectLinhVucChiTiet from './SelectBoSuuTap';

const FormDonViSo = (props: any) => {
	const { form, onCancel, setIsChangeTree, isChangeTree } = props;
	const { record, edit, postModel, putModel, formSubmiting, visibleForm, getAllModel } = useModel('danhmuc.donviso');

	useEffect(() => {
		const initvalue = record?.parentId;

		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id && edit) form.setFieldsValue(record);

		form.setFieldsValue({
			parentId: initvalue,
		});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DonViSo.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getAllModel)
				.then(() => {
					setIsChangeTree(!isChangeTree);
				})
				.catch((er) => console.log(er));
		} else {
			postModel(values, getAllModel)
				.then(() => {
					setIsChangeTree(!isChangeTree);
				})
				.catch((er) => console.log(er));
		}

		onCancel();
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				{/* {record?._id ? (
					<Col span={24}>
						<Form.Item name='maLinhVucCha' label='Lĩnh vực chung'>
							<SelectLinhVucChiTiet />
						</Form.Item>
					</Col>
				) : null} */}

				<Col span={24}>
					<Form.Item name='ma' label='Mã lĩnh vực' rules={[...rules.required, ...rules.length(80)]}>
						<Input placeholder='Nhập mã lĩnh vực' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='ten' label='Tên lĩnh vực' rules={[...rules.required, ...rules.length(250)]}>
						<Input placeholder='Nhập tên lĩnh vực' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Thêm mới' : 'Lưu lại'}
				</Button>
				<Button onClick={() => onCancel()}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormDonViSo;
