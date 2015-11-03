package com.rpsg.rpg.view.hover;

import com.badlogic.gdx.graphics.Color;
import com.rpsg.rpg.core.Setting;
import com.rpsg.rpg.system.base.Res;
import com.rpsg.rpg.system.ui.Counter;
import com.rpsg.rpg.system.ui.Icon;
import com.rpsg.rpg.system.ui.Image;


public class ThrowItemView extends SidebarView{

	public void init() {
		Icon icon = (Icon) param.get("item");
		group.addActor(Res.get(Setting.UI_BASE_IMG).size(545, 160).position(400, 280).a(.13f));
		group.addActor(new Image(icon).X(435).Y(300).scale(.6f));
		group.addActor(Res.get(icon.item.name, 38).position(575, 365).width(345).overflow(true).color(Color.valueOf("ff6600")));
		group.addActor(Res.get("持有 "+icon.item.count+" 个", 22).position(575, 330).width(345).overflow(true));
		group.addActor(new Counter(icon.item.count).position(435, 120));
		
		stage.setDebugAll(true);
	}
}