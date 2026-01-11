import ProfileDetails from "@/logic/Profile/ProfileDetails";

// const onChange = (key: string) => {
//   console.log(key);
// };

// const items: TabsProps["items"] = [
//   {
//     key: "1",
//     label: "Tab 1",
//     children: <ProfileRead />,
//   },
//   {
//     key: "2",
//     label: "Tab 2",
//     children: "Content of Tab Pane 2",
//   },
//   {
//     key: "3",
//     label: "Tab 3",
//     children: "Content of Tab Pane 3",
//   },
// ];

const settings: React.FC = () => (
  <>
    <ProfileDetails />
  </>
);

export default settings;
