import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type TabsType = {
  value: string;
  label: any;
  content: any;
};

type AnimatedTabsProps = {
  tabs: TabsType[];
};

export default function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setIndicatorStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      <div className="relative border-b border-gray-500/15">
        <Tabs.List className="relative flex">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              ref={(el: any) => (tabRefs.current[tab.value] = el)}
              className={clsx(
                "relative px-4 py-2 text-sm transition-colors",
                activeTab === tab.value
                  ? "font-medium text-cyan-400"
                  : "text-slate-300",
              )}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-cyan-400"
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </Tabs.List>
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tabs.map(
            (tab) =>
              activeTab === tab.value && (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm"
                >
                  {tab.content}
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>
    </Tabs.Root>
  );
}
