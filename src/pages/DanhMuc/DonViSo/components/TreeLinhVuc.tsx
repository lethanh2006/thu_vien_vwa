import ButtonExtend from '@/components/Table/ButtonExtend';
import { resetFieldsForm } from '@/utils/utils';
import {
	DeleteOutlined,
	DownOutlined,
	EditOutlined,
	FileAddOutlined,
	FolderOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Tree, message, type TreeProps } from 'antd';
import { type DataNode } from 'antd/lib/tree';
import { useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIntl, useModel } from 'umi';
import FormLinhVuc from './Form';
import styles from './style.less';

const TreeDonViSo = (props: any) => {
	const {
		setDanhSach,
		danhSach,
		getAllModel,
		visibleForm,
		setEdit,
		setRecord,
		deleteModel,
		edit,
		record,
		setIsView,
		setVisibleForm,
		deleteManyModel,
	} = useModel('danhmuc.donviso');
	const intl = useIntl();
	const [form] = Form.useForm();
	const [dialog, setDialog] = useState<boolean>(false);
	const [selectedKey, setselectedKeys] = useState<any>([]);
	const [treeData, setTreeData] = useState<{ key: React.Key; title: string }[]>([]);
	const [checkedKey, setCheckedKey] = useState<any[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<any>([]);
	const [statusDelete, setStatusDelete] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState('');
	const [autoExpandParent, setAutoExpandParent] = useState(true);
	const [isChangeTree, setIsChangeTree] = useState<boolean>(false);
	const [includeSearch, setIncludeSearch] = useState<string>('');
	const [isOpenListAction, setIsOpenListAction] = useState<boolean>(false);
	const [startPosition, setStartPosition] = useState<any>({
		startPositionX: 0,
		startPositionY: 0,
	});
	const [isCheckNode, setIsCheckNode] = useState<boolean>(false);

	const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
		let parentKey: React.Key;
		for (let i = 0; i < tree.length; i++) {
			const node = tree[i];
			if (node.children) {
				if (node.children.some((item) => item.key === key)) {
					parentKey = node.key;
				} else if (getParentKey(key, node.children)) {
					parentKey = getParentKey(key, node.children);
				}
			}
		}
		return parentKey!;
	};

	const groupByMaDonViCha: any = (data: any, parentId: string, processed = new Set()) => {
		const result = [];
		for (const item of data) {
			if (item.maLinhVucCha === parentId && !processed.has(item.id)) {
				processed.add(item.id);
				const children = groupByMaDonViCha(data, item.ma, processed);
				if (children.length > 0) {
					result.push({
						title: item?.name,
						key: item.id,
						icon: <FolderOutlined />,
						children,
					});
				} else {
					result.push({
						title: item?.name,
						key: item.id,
						icon: <FileAddOutlined />,
					});
				}
			}
		}
		return result;
	};

	useEffect(() => {
		const res = groupByMaDonViCha(danhSach);
		setTreeData(res);
	}, [isChangeTree, danhSach]);

	const searchTreeData = useMemo(() => {
		const loop = (data: DataNode[]): DataNode[] =>
			data.map((item) => {
				const strTitle = item.title as string;
				const title = (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[searchValue]}
						autoEscape
						textToHighlight={strTitle}
					/>
				);
				if (item.children) {
					return { title, key: item.key, children: loop(item.children), icon: item.icon };
				}

				return {
					title,
					key: item.key,
					icon: item.icon,
				};
			});
		return loop(treeData);
	}, [searchValue, danhSach]);

	useEffect(() => {
		if (!visibleForm)
			getAllModel(undefined, undefined, undefined, undefined, undefined, false).then((res: any) =>
				setDanhSach(res?.communities ?? []),
			);
	}, [visibleForm]);

	useEffect(() => {
		window.addEventListener('click', function (e: any) {
			setIsOpenListAction(false);
		});
		const handleContextmenu = (e: any) => {
			e.preventDefault();
		};
		document.addEventListener('contextmenu', handleContextmenu);
		return function cleanup() {
			document.removeEventListener('contextmenu', handleContextmenu);
		};
	}, []);

	const handleCancelDialog = () => {
		setDialog(false);
	};

	const AddnewDonVi = () => {
		setEdit(false);
		setVisibleForm(true);
		setIsOpenListAction(false);
	};

	const EditDonVi = () => {
		setEdit(true);
		setVisibleForm(true);
		setIsOpenListAction(false);
	};

	const handleDeleteDonvi = () => {
		setDialog(false);
		if (record?._id) {
			deleteModel(record._id, getAllModel);
			setTreeData(groupByMaDonViCha(danhSach));
			setIsChangeTree(!isChangeTree);
		}
	};

	const handleCancel = () => {
		resetFieldsForm(form);
		setVisibleForm(false);
	};

	const findDonVi: any = (arr: any, selectedKeyFind: string) => {
		for (let i = 0; i < arr?.length; i++) {
			if (arr[i].maDonVi === selectedKeyFind) {
				return arr[i]?.danhSachDonViCon || [];
			} else if (arr[i]?.danhSachDonViCon) {
				const result = findDonVi(arr[i]?.danhSachDonViCon, selectedKeyFind);
				if (result) {
					return result;
				}
			}
		}
	};

	useEffect(() => {}, [record?._id]);

	const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
		// Tránh việc click lại item đang select thì phải select về root
		if (selectedKeys.length) {
			setselectedKeys(selectedKeys);
			const res = danhSach.find((item: DonViSo.IRecord) => item._id === selectedKeys[0]);
			setRecord(res);
		}
	};

	const onExpand: TreeProps['onExpand'] = (expandKeys) => {
		setExpandedKeys(expandKeys);
		setAutoExpandParent(false);
	};

	const buildCheckedKeys = (arr: string[], item: any) => {
		arr.push(item.key);
		if (item.children) item.children.map((ele: any) => buildCheckedKeys(arr, ele));
	};

	const onCheck: TreeProps['onCheck'] = (checkedKeys: any, info) => {
		const keys: string[] = [];
		buildCheckedKeys(keys, info.node);
		setCheckedKey(info.checked ? [...checkedKey, ...keys] : checkedKey.filter((item) => !keys.includes(item)));
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setIncludeSearch(e.target.value);
		const newExpandedKeys = danhSach
			.filter((item) => item.ten?.indexOf(value) > -1 && item.parentId)
			.map((item) => item.parentId);
		setExpandedKeys(newExpandedKeys as React.Key[]);
		setSearchValue(value);
		setAutoExpandParent(true);
	};

	const onClickConfirmDelete = () => {
		if (checkedKey.length > 0) {
			Modal.confirm({
				title: intl.formatMessage({ id: 'danhmuc.donviso.tree.modal.title.xacnhanxoa' }),
				content: intl.formatMessage(
					{ id: 'danhmuc.donviso.tree.modal.content.xacnhanxoanhieu' },
					{ count: checkedKey.length },
				),
				onOk: () => {
					deleteManyModel(checkedKey, getAllModel);
					setTreeData(groupByMaDonViCha(danhSach));
					setIsChangeTree(!isChangeTree);
				},
			});
		} else message.warning(intl.formatMessage({ id: 'danhmuc.donviso.tree.message.warning.chonxoa' }));
	};

	useEffect(() => {
		setselectedKeys([]);
		setRecord(undefined);
	}, [window.location.href]);

	const renderLeftHeader = () => {
		return (
			<div className={styles.treeSelectHeader}>
				{isOpenListAction && (
					<ul
						className={styles.popupListAction}
						style={{
							top: startPosition.startPositionY,
							left: startPosition.startPositionX,
						}}
					>
						<li className={styles.action}>
							<span onClick={AddnewDonVi}>
								<FileAddOutlined /> {intl.formatMessage({ id: 'danhmuc.donviso.tree.contextmenu.themcon' })}
							</span>
						</li>
						{!isCheckNode && (
							<li className={styles.action}>
								<span onClick={EditDonVi}>
									<EditOutlined /> {intl.formatMessage({ id: 'danhmuc.donviso.tree.contextmenu.chinhsua' })}
								</span>
							</li>
						)}
						{!isCheckNode && (
							<li className={styles.action}>
								<span
									className={styles.danger}
									onClick={() => {
										setIsOpenListAction(false);
										setDialog(true);
									}}
								>
									<DeleteOutlined /> {intl.formatMessage({ id: 'danhmuc.donviso.tree.contextmenu.xoa' })}
								</span>
							</li>
						)}
					</ul>
				)}
				<Space style={{ marginBottom: 12 }} wrap>
					<ButtonExtend
						onClick={() => {
							setRecord({} as DonViSo.IRecord);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
						type='primary'
						notHideText
						tooltip={intl.formatMessage({ id: 'danhmuc.donviso.tree.tooltip.themmoidulieu' })}
					>
						{intl.formatMessage({ id: 'danhmuc.donviso.tree.button.themmoi' })}
					</ButtonExtend>
					{statusDelete ? (
						<>
							<Button danger type='default' onClick={onClickConfirmDelete}>
								{intl.formatMessage({ id: 'danhmuc.donviso.tree.button.xacnhanxoa' })}
							</Button>
							<Button onClick={() => setStatusDelete(false)} type='link'>
								{intl.formatMessage({ id: 'danhmuc.donviso.tree.button.huy' })}
							</Button>
						</>
					) : (
						<Button
							danger
							type='link'
							icon={<DeleteOutlined />}
							onClick={() => {
								setStatusDelete(true);
							}}
						>
							{intl.formatMessage({ id: 'danhmuc.donviso.tree.button.xoalinhvuc' })}
						</Button>
					)}
				</Space>
				<div style={{ width: 300 }}>
					<Input.Search
						value={includeSearch}
						style={{ marginBottom: 8 }}
						placeholder={intl.formatMessage({ id: 'danhmuc.donviso.tree.search.placeholder' })}
						onChange={onChange}
						allowClear
					/>
				</div>
			</div>
		);
	};

	const renderTree = () => {
		return (
			<div className={styles.treeSelectBody}>
				<Tree
					expandedKeys={expandedKeys}
					onExpand={onExpand}
					checkStrictly
					checkedKeys={checkedKey}
					selectedKeys={selectedKey}
					onRightClick={(e: any) => {
						const res = danhSach.find((item: DonViSo.IRecord) => item._id === e.node.key);
						setRecord(res);
						setIsCheckNode(false);
						setStartPosition({
							startPositionX: e.event.clientX,
							startPositionY: e.event.clientY,
						});
						setIsOpenListAction(true);
					}}
					showLine={{ showLeafIcon: false }}
					switcherIcon={<DownOutlined />}
					onSelect={onSelect}
					treeData={searchValue !== '' ? searchTreeData : treeData}
					checkable={statusDelete}
					onCheck={onCheck}
					autoExpandParent={autoExpandParent}
				/>
			</div>
		);
	};

	return (
		<>
			<div className={styles.treeSelectContainer}>
				{renderLeftHeader()}
				{renderTree()}
			</div>

			<Modal
				destroyOnClose
				open={visibleForm}
				onOk={handleCancel}
				onCancel={handleCancel}
				footer={null}
				title={
					(edit
						? intl.formatMessage({ id: 'danhmuc.donviso.tree.modal.title.chinhsua' })
						: intl.formatMessage({ id: 'danhmuc.donviso.tree.modal.title.themmoi' })) + ' lĩnh vực'
				}
			>
				<FormLinhVuc
					onCancel={handleCancel}
					form={form}
					setIsChangeTree={setIsChangeTree}
					isChangeTree={isChangeTree}
				/>
			</Modal>

			<Modal
				open={dialog}
				onOk={handleCancelDialog}
				onCancel={handleCancelDialog}
				footer={
					<>
						<Button onClick={handleCancelDialog}>
							{intl.formatMessage({ id: 'danhmuc.donviso.tree.button.huy' })}
						</Button>
						<Button danger onClick={handleDeleteDonvi}>
							{intl.formatMessage({ id: 'danhmuc.donviso.tree.button.xacnhan' })}
						</Button>
					</>
				}
				title={intl.formatMessage({ id: 'danhmuc.donviso.tree.modal.title.xacnhanxoa' })}
			>
				{intl.formatMessage({ id: 'danhmuc.donviso.tree.modal.content.xacnhanxoa' })}
			</Modal>
		</>
	);
};

export default TreeDonViSo;
