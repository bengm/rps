class CreateGame < ActiveRecord::Migration
  def up
    create_table :games do |t|
      t.string    :playerMove
      t.string    :opponentMove
      t.datetime  :time
      t.string    :result
    end
  end

  def down
    drop_table :games
  end
end
